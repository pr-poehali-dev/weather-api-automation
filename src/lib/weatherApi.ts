const WEATHER_API_URL = 'https://functions.poehali.dev/6bade6fd-8fdf-4222-ba21-a1657070aefd';
const FORECAST_API_URL = 'https://functions.poehali.dev/6f91929f-8c2a-44e3-8cf3-01237f74fcf2';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  clouds: number;
  condition: string;
  icon: string;
  sunrise: number;
  sunset: number;
  city_name: string;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  condition: string;
  icon: string;
  pop: number;
}

export interface ForecastData {
  city_name: string;
  forecast: ForecastItem[];
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`${WEATHER_API_URL}?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json();
}

export async function getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  return response.json();
}

export async function getForecast(city: string): Promise<ForecastData> {
  const response = await fetch(`${FORECAST_API_URL}?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  return response.json();
}

export async function getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
  const response = await fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  return response.json();
}

export function getWeatherIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'Sun',
    '01n': 'Moon',
    '02d': 'CloudSun',
    '02n': 'CloudMoon',
    '03d': 'Cloud',
    '03n': 'Cloud',
    '04d': 'Cloudy',
    '04n': 'Cloudy',
    '09d': 'CloudRain',
    '09n': 'CloudRain',
    '10d': 'CloudRainWind',
    '10n': 'CloudRainWind',
    '11d': 'CloudLightning',
    '11n': 'CloudLightning',
    '13d': 'CloudSnow',
    '13n': 'CloudSnow',
    '50d': 'CloudFog',
    '50n': 'CloudFog',
  };
  return iconMap[icon] || 'Cloud';
}

export function getWindDirection(degrees: number): string {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getVisibilityQuality(visibility: number): string {
  if (visibility >= 10000) return 'Отличная';
  if (visibility >= 5000) return 'Хорошая';
  if (visibility >= 2000) return 'Средняя';
  if (visibility >= 1000) return 'Плохая';
  return 'Очень плохая';
}

export function getHumidityComfort(humidity: number): string {
  if (humidity < 30) return 'Сухо';
  if (humidity < 60) return 'Комфортно';
  if (humidity < 80) return 'Влажно';
  return 'Очень влажно';
}

export function getUVLevel(uv: number): string {
  if (uv <= 2) return 'Низкий';
  if (uv <= 5) return 'Средний';
  if (uv <= 7) return 'Высокий';
  if (uv <= 10) return 'Очень высокий';
  return 'Экстремальный';
}
