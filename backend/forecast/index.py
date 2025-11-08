'''
Business: Получение прогноза погоды на 5 дней через OpenWeatherMap API
Args: event - dict с httpMethod, queryStringParameters (lat, lon, city)
      context - объект с request_id
Returns: HTTP response с прогнозом погоды
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
            url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ru'
        elif city:
            encoded_city = urllib.parse.quote(city)
            url = f'https://api.openweathermap.org/data/2.5/forecast?q={encoded_city},RU&appid={api_key}&units=metric&lang=ru'
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required parameters: lat/lon or city'})
            }
        
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        forecast_list = []
        for item in data['list']:
            forecast_list.append({
                'dt': item['dt'],
                'temp': round(item['main']['temp']),
                'feels_like': round(item['main']['feels_like']),
                'temp_min': round(item['main']['temp_min']),
                'temp_max': round(item['main']['temp_max']),
                'pressure': item['main']['pressure'],
                'humidity': item['main']['humidity'],
                'wind_speed': item['wind']['speed'],
                'wind_deg': item['wind'].get('deg', 0),
                'clouds': item['clouds']['all'],
                'condition': item['weather'][0]['description'],
                'icon': item['weather'][0]['icon'],
                'pop': item.get('pop', 0)
            })
        
        result = {
            'city_name': data['city']['name'],
            'forecast': forecast_list
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(result)
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