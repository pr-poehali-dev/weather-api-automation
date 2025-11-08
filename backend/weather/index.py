'''
Business: Получение погодных данных через OpenWeatherMap API
Args: event - dict с httpMethod, queryStringParameters (lat, lon, city)
      context - объект с request_id
Returns: HTTP response с данными о погоде
'''
import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    lat = params.get('lat')
    lon = params.get('lon')
    city = params.get('city')
    
    api_key = os.environ.get('OPENWEATHER_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    try:
        if lat and lon:
            url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ru'
        elif city:
            encoded_city = urllib.parse.quote(city)
            url = f'https://api.openweathermap.org/data/2.5/weather?q={encoded_city},RU&appid={api_key}&units=metric&lang=ru'
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required parameters: lat/lon or city'})
            }
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        weather_data = {
            'temp': round(data['main']['temp']),
            'feels_like': round(data['main']['feels_like']),
            'temp_min': round(data['main']['temp_min']),
            'temp_max': round(data['main']['temp_max']),
            'pressure': data['main']['pressure'],
            'humidity': data['main']['humidity'],
            'visibility': data.get('visibility', 10000),
            'wind_speed': data['wind']['speed'],
            'wind_deg': data['wind'].get('deg', 0),
            'wind_gust': data['wind'].get('gust', data['wind']['speed']),
            'clouds': data['clouds']['all'],
            'condition': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],
            'sunrise': data['sys']['sunrise'],
            'sunset': data['sys']['sunset'],
            'city_name': data['name']
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(weather_data)
        }
        
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else str(e)
        error_msg = f'OpenWeatherMap API error: {error_body}'
        if e.code == 401:
            error_msg = 'API ключ недействителен или ещё не активирован. Новые ключи активируются в течение 1-2 часов после регистрации. Проверьте ключ на https://home.openweathermap.org/api_keys'
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': error_msg, 'api_status': e.code})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }