import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';
import { getCurrentWeatherByCoords, getForecastByCoords, getWeatherIcon, getWindDirection, getVisibilityQuality, getHumidityComfort, type WeatherData, type ForecastData } from '@/lib/weatherApi';

const CityWeather = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const city = russianCities.find(c => c.name === cityName);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;
    
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [weather, forecast] = await Promise.all([
          getCurrentWeatherByCoords(city.lat, city.lon),
          getForecastByCoords(city.lat, city.lon)
        ]);
        setWeatherData(weather);
        setForecastData(forecast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [city]);

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Город не найден</h2>
            <p className="text-muted-foreground mb-4">Город "{cityName}" не найден в базе данных</p>
            <Link to="/cities">
              <Button>Вернуться к списку городов</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTemp = weatherData?.temp ?? Math.floor(Math.random() * 30) - 15;
  const mockHumidity = weatherData?.humidity ?? Math.floor(Math.random() * 40) + 50;
  const mockPressure = weatherData?.pressure ?? Math.floor(Math.random() * 30) + 995;
  const mockWind = weatherData?.wind_speed ?? Math.floor(Math.random() * 15) + 2;
  const mockClouds = weatherData?.clouds ?? Math.floor(Math.random() * 100);
  const mockVisibility = weatherData?.visibility ?? (Math.floor(Math.random() * 10) + 5) * 1000;
  const mockFeelsLike = weatherData?.feels_like ?? currentTemp - 3;

  const hourlyForecast = forecastData
    ? forecastData.forecast.slice(0, 24).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temp: item.temp,
        condition: getWeatherIcon(item.icon),
        wind: item.wind_speed,
      }))
    : Array.from({ length: 24 }).map((_, idx) => ({
        time: `${String(idx).padStart(2, '0')}:00`,
        temp: currentTemp + Math.sin(idx / 3) * 4,
        condition: idx % 3 === 0 ? 'CloudRain' : idx % 2 === 0 ? 'Cloud' : 'Sun',
        wind: Math.floor(Math.random() * 15) + 2,
      }));

  const getDailyForecast = () => {
    if (!forecastData) {
      return Array.from({ length: 10 }).map((_, idx) => {
        const date = new Date();
        date.setDate(date.getDate() + idx);
        return {
          day: idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : date.toLocaleDateString('ru-RU', { weekday: 'short' }),
          date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
          icon: idx % 3 === 0 ? 'CloudRain' : idx % 2 === 0 ? 'Cloud' : 'Sun',
          condition: idx % 3 === 0 ? 'Дождь' : idx % 2 === 0 ? 'Облачно' : 'Ясно',
          tempMax: Math.round(currentTemp + Math.sin(idx) * 5 + 2),
          tempMin: Math.round(currentTemp + Math.sin(idx) * 5 - 3),
          precip: idx % 3 === 0 ? 80 : 10,
        };
      });
    }

    const dailyMap = new Map();
    forecastData.forecast.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: date,
          temps: [],
          icons: [],
          conditions: [],
          precips: []
        });
      }
      
      const dayData = dailyMap.get(dateKey);
      dayData.temps.push(item.temp);
      dayData.icons.push(item.icon);
      dayData.conditions.push(item.condition);
      dayData.precips.push(item.pop);
    });

    return Array.from(dailyMap.values()).slice(0, 10).map((day, idx) => ({
      day: idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : day.date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      date: day.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      icon: getWeatherIcon(day.icons[Math.floor(day.icons.length / 2)]),
      condition: day.conditions[Math.floor(day.conditions.length / 2)],
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      precip: Math.round(Math.max(...day.precips) * 100)
    }));
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="CloudSun" size={32} className="text-primary" />
              <span className="text-2xl font-bold text-primary">MASCLIMAT.RU</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Icon name="Home" size={16} className="mr-2" />
                  Главная
                </Button>
              </Link>
              <Link to="/cities">
                <Button variant="outline" size="sm">
                  <Icon name="Map" size={16} className="mr-2" />
                  Все города
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-3">{city.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="default" className="text-sm">{city.region}</Badge>
                  {city.federalDistrict && (
                    <Badge variant="outline" className="text-sm">{city.federalDistrict}</Badge>
                  )}
                  {city.timezone && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>{city.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {city.description && (
              <p className="text-muted-foreground mb-4">{city.description}</p>
            )}
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Users" size={20} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Население</div>
                  <div className="font-bold">{(city.population / 1000000).toFixed(2)} млн</div>
                </div>
              </div>
              
              {city.foundedYear && (
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Основан</div>
                    <div className="font-bold">{city.foundedYear} год</div>
                  </div>
                </div>
              )}
              
              {city.areaKm2 && (
                <div className="flex items-center gap-2">
                  <Icon name="Square" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Площадь</div>
                    <div className="font-bold">{city.areaKm2} км²</div>
                  </div>
                </div>
              )}
              
              {city.elevation && (
                <div className="flex items-center gap-2">
                  <Icon name="Mountain" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Высота</div>
                    <div className="font-bold">{city.elevation} м</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Координаты</div>
                  <div className="font-bold text-xs">{city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</div>
                </div>
              </div>
              
              {city.population && city.areaKm2 && (
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Плотность</div>
                    <div className="font-bold">{Math.round(city.population / city.areaKm2)} чел/км²</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Загрузка данных...
          </div>
        )}
        
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={20} className="text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-orange-900">Не удалось загрузить данные</div>
                <div className="text-sm text-orange-700 mt-1">Убедитесь, что добавлен API ключ OpenWeatherMap</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <Icon name={weatherData ? getWeatherIcon(weatherData.icon) : (mockClouds > 70 ? 'Cloud' : mockClouds > 30 ? 'CloudSun' : 'Sun')} size={80} className="text-primary" />
                    <div>
                      <div className="text-6xl font-bold">{currentTemp}°</div>
                      <div className="text-muted-foreground mt-1">
                        Ощущается как {mockFeelsLike}°
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {weatherData?.condition ?? (mockClouds > 70 ? 'Облачно' : mockClouds > 30 ? 'Переменная облачность' : 'Ясно')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Droplets" size={16} />
                      <span>Влажность</span>
                    </div>
                    <div className="text-2xl font-bold">{mockHumidity}%</div>
                    <div className="text-xs text-muted-foreground">{weatherData ? getHumidityComfort(mockHumidity) : (mockHumidity > 70 ? 'Влажно' : 'Комфортно')}</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Gauge" size={16} />
                      <span>Давление</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(mockPressure * 0.75)}</div>
                    <div className="text-xs text-muted-foreground">мм рт.ст. ({mockPressure} гПа)</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Wind" size={16} />
                      <span>Ветер</span>
                    </div>
                    <div className="text-2xl font-bold">{mockWind.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">м/с, {weatherData ? getWindDirection(weatherData.wind_deg) : 'СЗ'}</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Eye" size={16} />
                      <span>Видимость</span>
                    </div>
                    <div className="text-2xl font-bold">{(mockVisibility / 1000).toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">км, {weatherData ? getVisibilityQuality(mockVisibility) : (mockVisibility > 8000 ? 'хорошая' : 'средняя')}</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="CloudRain" size={16} />
                      <span>Осадки</span>
                    </div>
                    <div className="text-2xl font-bold">0.2 мм</div>
                    <div className="text-xs text-muted-foreground">За последний час</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Cloud" size={16} />
                      <span>Облачность</span>
                    </div>
                    <div className="text-2xl font-bold">{mockClouds}%</div>
                    <div className="text-xs text-muted-foreground">{mockClouds > 70 ? 'Пасмурно' : mockClouds > 30 ? 'Облачно' : 'Ясно'}</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Navigation" size={16} />
                      <span>Направление</span>
                    </div>
                    <div className="text-2xl font-bold">СЗ</div>
                    <div className="text-xs text-muted-foreground">330° азимут</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Thermometer" size={16} />
                      <span>Точка росы</span>
                    </div>
                    <div className="text-2xl font-bold">{currentTemp - 5}°</div>
                    <div className="text-xs text-muted-foreground">Конденсация</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Почасовой прогноз</h2>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {hourlyForecast.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[90px] p-3 bg-secondary/30 rounded-lg">
                      <div className="text-sm font-medium mb-2">{item.time}</div>
                      <Icon name={item.condition as any} size={28} className="text-primary mb-2" />
                      <div className="text-lg font-bold">{Math.round(item.temp)}°</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Icon name="Wind" size={10} />
                        {item.wind} м/с
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Прогноз на 10 дней</h2>
                <div className="space-y-2">
                  {dailyForecast.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-20 font-medium">{item.day}</div>
                        <div className="text-sm text-muted-foreground w-20">{item.date}</div>
                        <Icon name={item.icon as any} size={28} className="text-primary" />
                        <span className="text-sm text-muted-foreground w-24">{item.condition}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-muted-foreground">{item.precip}%</div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.tempMin}°</span>
                          <div className="w-24 h-2 bg-gradient-to-r from-blue-300 to-orange-300 rounded-full" />
                          <span className="font-bold text-lg">{item.tempMax}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold mb-3">Дополнительная информация</h3>
                
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Восход</span>
                    <div className="flex items-center gap-2">
                      <Icon name="Sunrise" size={16} className="text-primary" />
                      <span className="font-bold">06:42</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Закат</span>
                    <div className="flex items-center gap-2">
                      <Icon name="Sunset" size={16} className="text-primary" />
                      <span className="font-bold">18:24</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Облачность</span>
                    <span className="font-bold">{mockClouds}%</span>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Точка росы</span>
                    <span className="font-bold">{currentTemp - 5}°C</span>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">УФ индекс</span>
                    <Badge>{Math.floor(Math.random() * 11)}</Badge>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Продолж. дня</span>
                    <span className="font-bold">11:42</span>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Снежный покров</span>
                    <span className="font-bold">{currentTemp < 0 ? '12 см' : '0 см'}</span>
                  </div>
                </div>

                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Индекс тепла</span>
                    <span className="font-bold">{currentTemp > 20 ? currentTemp + 2 + '°' : 'Н/Д'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={24} className="text-primary mt-1" />
                  <div className="w-full">
                    <h3 className="font-bold mb-2">Магнитные бури</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Сегодня:</span>
                        <span className="font-medium text-green-600">Спокойно</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Завтра:</span>
                        <span className="font-medium text-yellow-600">Слабо</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={24} className="text-orange-600 mt-1" />
                  <div className="w-full">
                    <h3 className="font-bold mb-2">Качество воздуха</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>AQI:</span>
                        <span className="font-medium text-green-600">42 (Хорошо)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PM2.5:</span>
                        <span className="font-medium text-green-600">38 мкг/м³</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Icon name="Moon" size={24} className="text-purple-600 mt-1" />
                  <div className="w-full">
                    <h3 className="font-bold mb-2">Луна</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Фаза:</span>
                        <span className="font-medium">Убывающая</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Видимость:</span>
                        <span className="font-medium">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CityWeather;