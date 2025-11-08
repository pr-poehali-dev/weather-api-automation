import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTemp = -5;
  const feelsLike = -9;
  const condition = 'пасмурно';

  const hourlyForecast = [
    { time: 'Сейчас', temp: -5, condition: 'Cloud', precip: 0 },
    { time: '01:00', temp: -6, condition: 'Cloud', precip: 0 },
    { time: '02:00', temp: -6, condition: 'CloudSnow', precip: 20 },
    { time: '03:00', temp: -7, condition: 'CloudSnow', precip: 40 },
    { time: '04:00', temp: -7, condition: 'Cloud', precip: 10 },
    { time: '05:00', temp: -8, condition: 'Cloud', precip: 0 },
  ];

  const weeklyForecast = [
    { day: 'Пн', date: '11 нояб', icon: 'CloudSnow', tempMax: -3, tempMin: -8 },
    { day: 'Вт', date: '12 нояб', icon: 'Cloud', tempMax: -2, tempMin: -7 },
    { day: 'Ср', date: '13 нояб', icon: 'Sun', tempMax: 0, tempMin: -5 },
    { day: 'Чт', date: '14 нояб', icon: 'Cloud', tempMax: 1, tempMin: -4 },
    { day: 'Пт', date: '15 нояб', icon: 'CloudRain', tempMax: 2, tempMin: -3 },
    { day: 'Сб', date: '16 нояб', icon: 'Cloud', tempMax: 0, tempMin: -5 },
    { day: 'Вс', date: '17 нояб', icon: 'Sun', tempMax: 1, tempMin: -6 },
  ];

  const topCities = russianCities.slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="CloudSun" size={32} className="text-primary" />
              <span className="text-2xl font-bold text-primary">RU-METEO</span>
            </Link>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск города..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Link to="/cities">
              <Button variant="outline">
                <Icon name="Map" size={18} className="mr-2" />
                Все города
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              Сейчас
            </Button>
            <Button variant="ghost" size="sm">
              Сегодня
            </Button>
            <Button variant="ghost" size="sm">
              Завтра
            </Button>
            <Button variant="ghost" size="sm">
              3 дня
            </Button>
            <Button variant="ghost" size="sm">
              10 дней
            </Button>
            <Button variant="ghost" size="sm">
              2 недели
            </Button>
            <Button variant="ghost" size="sm">
              Месяц
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedCity}</h1>
                    <div className="text-sm text-muted-foreground">
                      {currentTime.toLocaleDateString('ru-RU', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • {currentTime.toLocaleTimeString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-primary">{currentTemp}°</div>
                    <div className="text-sm text-muted-foreground mt-1">{condition}</div>
                    <div className="text-xs text-muted-foreground">Ощущается как {feelsLike}°</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Wind" size={16} />
                      <span>Ветер</span>
                    </div>
                    <div className="text-2xl font-bold">5.6 м/с</div>
                    <div className="text-xs text-muted-foreground">СЗ, порывы до 12 м/с</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Gauge" size={16} />
                      <span>Давление</span>
                    </div>
                    <div className="text-2xl font-bold">761</div>
                    <div className="text-xs text-muted-foreground">мм рт.ст. (1015 гПа)</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Droplets" size={16} />
                      <span>Влажность</span>
                    </div>
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-xs text-muted-foreground">Очень влажно</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Eye" size={16} />
                      <span>Видимость</span>
                    </div>
                    <div className="text-2xl font-bold">10 км</div>
                    <div className="text-xs text-muted-foreground">Хорошая</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="CloudRain" size={16} />
                      <span>Осадки</span>
                    </div>
                    <div className="text-2xl font-bold">0 мм</div>
                    <div className="text-xs text-muted-foreground">За последний час</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Cloud" size={16} />
                      <span>Облачность</span>
                    </div>
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-xs text-muted-foreground">Пасмурно</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Sunrise" size={16} />
                      <span>Восход</span>
                    </div>
                    <div className="text-2xl font-bold">06:42</div>
                    <div className="text-xs text-muted-foreground">Закат в 18:24</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Thermometer" size={16} />
                      <span>Точка росы</span>
                    </div>
                    <div className="text-2xl font-bold">-7°C</div>
                    <div className="text-xs text-muted-foreground">Влажно</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Sun" size={16} />
                      <span>УФ индекс</span>
                    </div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-xs text-muted-foreground">Низкий</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Navigation" size={16} />
                      <span>Направление</span>
                    </div>
                    <div className="text-2xl font-bold">330°</div>
                    <div className="text-xs text-muted-foreground">Северо-западный</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Waves" size={16} />
                      <span>Снежный покров</span>
                    </div>
                    <div className="text-2xl font-bold">12 см</div>
                    <div className="text-xs text-muted-foreground">Умеренный</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Icon name="Clock" size={16} />
                      <span>Продолж. дня</span>
                    </div>
                    <div className="text-2xl font-bold">11:42</div>
                    <div className="text-xs text-muted-foreground">Часов</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Почасовой прогноз</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {hourlyForecast.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[100px] p-3 bg-secondary/30 rounded-lg">
                      <div className="text-sm font-medium mb-2">{item.time}</div>
                      <Icon name={item.condition as any} size={32} className="text-primary mb-2" />
                      <div className="text-xl font-bold mb-1">{item.temp}°</div>
                      {item.precip > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="CloudRain" size={12} />
                          {item.precip}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Прогноз на неделю</h2>
                <div className="space-y-2">
                  {weeklyForecast.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 text-sm font-medium">{item.day}</div>
                        <div className="text-sm text-muted-foreground w-24">{item.date}</div>
                        <Icon name={item.icon as any} size={28} className="text-primary" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">{item.tempMin}°</div>
                        <div className="w-20 h-2 bg-gradient-to-r from-blue-300 to-orange-300 rounded-full" />
                        <div className="text-lg font-bold">{item.tempMax}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Крупные города России</h2>
                <div className="space-y-2">
                  {topCities.slice(0, 10).map((city, idx) => (
                    <Link key={idx} to={`/city/${city.name}`}>
                      <div className="flex items-center justify-between p-2 hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer">
                        <span className="text-sm font-medium">{city.name}</span>
                        <span className="text-lg font-bold text-primary">
                          {Math.floor(Math.random() * 20) - 10}°
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/cities">
                  <Button variant="outline" className="w-full mt-4">
                    Показать все города
                  </Button>
                </Link>
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
                      <div className="flex justify-between">
                        <span>Послезавтра:</span>
                        <span className="font-medium text-green-600">Спокойно</span>
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
                    <h3 className="font-bold mb-2">Индекс загрязнения воздуха</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span>PM2.5:</span>
                        <span className="font-medium text-green-600">42 (Хорошо)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>PM10:</span>
                        <span className="font-medium text-green-600">38 (Хорошо)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>O₃:</span>
                        <span className="font-medium text-yellow-600">68 (Средне)</span>
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
                    <h3 className="font-bold mb-2">Фазы Луны</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Фаза:</span>
                        <span className="font-medium">Убывающая</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Видимость:</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Восход:</span>
                        <span className="font-medium">22:14</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Icon name="CalendarDays" size={20} />
                  Праздники и события
                </h3>
                <div className="text-sm space-y-2">
                  <div className="p-2 bg-secondary/30 rounded">
                    <div className="font-medium">8 ноября</div>
                    <div className="text-xs text-muted-foreground">День памяти погибших при исполнении</div>
                  </div>
                  <div className="p-2 bg-secondary/30 rounded">
                    <div className="font-medium">10 ноября</div>
                    <div className="text-xs text-muted-foreground">День сотрудника органов внутренних дел</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="russia" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="russia">Россия</TabsTrigger>
                <TabsTrigger value="ukraine">Украина</TabsTrigger>
                <TabsTrigger value="belarus">Беларусь</TabsTrigger>
                <TabsTrigger value="kazakhstan">Казахстан</TabsTrigger>
              </TabsList>

              <TabsContent value="russia" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {topCities.slice(0, 18).map((city, idx) => (
                    <Link key={idx} to={`/city/${city.name}`}>
                      <div className="p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer text-center">
                        <div className="text-sm font-medium mb-2">{city.name}</div>
                        <Icon name="Cloud" size={24} className="mx-auto mb-2 text-primary" />
                        <div className="text-xl font-bold">{Math.floor(Math.random() * 20) - 10}°</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ukraine" className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  Данные для городов Украины загружаются...
                </div>
              </TabsContent>

              <TabsContent value="belarus" className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  Данные для городов Беларуси загружаются...
                </div>
              </TabsContent>

              <TabsContent value="kazakhstan" className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  Данные для городов Казахстана загружаются...
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 RU-METEO. Прогноз погоды для городов России</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;