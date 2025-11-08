import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  icon: string;
  alerts: string[];
}

const mockWeatherData: WeatherData = {
  city: 'Москва',
  temp: -5,
  feelsLike: -9,
  humidity: 78,
  pressure: 1013,
  windSpeed: 12,
  windDirection: 'СЗ',
  condition: 'Облачно с прояснениями',
  icon: 'Cloud',
  alerts: ['Сильный ветер до 18 м/с', 'Гололедица на дорогах']
};

const russianCities = [
  { name: 'Москва', temp: -5, condition: 'Облачно', lat: 55.75, lon: 37.62 },
  { name: 'Санкт-Петербург', temp: -3, condition: 'Снег', lat: 59.93, lon: 30.36 },
  { name: 'Новосибирск', temp: -18, condition: 'Ясно', lat: 55.03, lon: 82.92 },
  { name: 'Екатеринбург', temp: -12, condition: 'Облачно', lat: 56.84, lon: 60.61 },
  { name: 'Казань', temp: -8, condition: 'Снег', lat: 55.79, lon: 49.12 },
  { name: 'Нижний Новгород', temp: -7, condition: 'Облачно', lat: 56.33, lon: 44.00 },
  { name: 'Челябинск', temp: -15, condition: 'Ясно', lat: 55.16, lon: 61.40 },
  { name: 'Самара', temp: -9, condition: 'Метель', lat: 53.20, lon: 50.15 },
  { name: 'Омск', temp: -20, condition: 'Ясно', lat: 54.99, lon: 73.37 },
  { name: 'Ростов-на-Дону', temp: 2, condition: 'Дождь', lat: 47.23, lon: 39.72 },
  { name: 'Уфа', temp: -11, condition: 'Облачно', lat: 54.74, lon: 55.97 },
  { name: 'Красноярск', temp: -16, condition: 'Снег', lat: 56.01, lon: 92.85 },
  { name: 'Воронеж', temp: -4, condition: 'Облачно', lat: 51.67, lon: 39.18 },
  { name: 'Пермь', temp: -13, condition: 'Снег', lat: 58.01, lon: 56.25 },
  { name: 'Волгоград', temp: -2, condition: 'Облачно', lat: 48.72, lon: 44.50 }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(mockWeatherData.city);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1A1F2C] to-[#0F1419] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="glass rounded-2xl p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-primary glow">МЕТЕО·РФ</h1>
              <p className="text-muted-foreground mt-2">Погодный мониторинг в реальном времени</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/cities">
                <Button className="glass border-primary/50 hover:glow-box">
                  <Icon name="Map" size={18} className="mr-2" />
                  Все города
                </Button>
              </Link>
              <div className="flex flex-col items-end gap-1">
                <div className="text-3xl font-bold text-secondary glow">
                  {currentTime.toLocaleTimeString('ru-RU')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {mockWeatherData.alerts.length > 0 && (
          <div className="glass rounded-xl p-4 border-l-4 border-destructive animate-pulse-glow">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" className="text-destructive mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-2">Погодные предупреждения</h3>
                {mockWeatherData.alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
                    <span className="text-sm">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl">{selectedCity}</span>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {mockWeatherData.condition}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Icon name={mockWeatherData.icon as any} size={80} className="text-primary" />
                  <div>
                    <div className="text-7xl font-bold glow">{mockWeatherData.temp}°</div>
                    <div className="text-muted-foreground mt-2">
                      Ощущается как {mockWeatherData.feelsLike}°
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="glass p-4 rounded-xl text-center">
                  <Icon name="Droplets" size={24} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockWeatherData.humidity}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Влажность</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <Icon name="Gauge" size={24} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockWeatherData.pressure}</div>
                  <div className="text-xs text-muted-foreground mt-1">мм рт.ст.</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <Icon name="Wind" size={24} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{mockWeatherData.windSpeed}</div>
                  <div className="text-xs text-muted-foreground mt-1">м/с {mockWeatherData.windDirection}</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <Icon name="Eye" size={24} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">10</div>
                  <div className="text-xs text-muted-foreground mt-1">км видимость</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Прогноз на 7 дней</h3>
                  <Link to={`/city/${selectedCity}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day, idx) => (
                    <div key={idx} className="glass p-3 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <Icon name="Cloud" size={20} className="mx-auto mb-2 text-primary" />
                      <div className="text-sm font-bold">{-5 + idx}°</div>
                      <div className="text-xs text-muted-foreground">{-10 + idx}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MapPin" size={20} />
                Города России
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {russianCities.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCity(city.name)}
                    className={`w-full glass p-3 rounded-lg text-left transition-all hover:glow-box ${
                      selectedCity === city.name ? 'border-primary border-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{city.name}</div>
                        <div className="text-xs text-muted-foreground">{city.condition}</div>
                      </div>
                      <div className="text-2xl font-bold glow">{city.temp}°</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="glass border-0 w-full justify-start">
            <TabsTrigger value="map" className="data-[state=active]:glow-box">
              <Icon name="Map" size={16} className="mr-2" />
              Карта погоды
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:glow-box">
              <Icon name="LineChart" size={16} className="mr-2" />
              Графики
            </TabsTrigger>
            <TabsTrigger value="radar" className="data-[state=active]:glow-box">
              <Icon name="Radio" size={16} className="mr-2" />
              Метеорадар
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <Card className="glass border-0">
              <CardContent className="p-0">
                <div className="relative w-full h-[500px] bg-gradient-to-br from-[#0A0E1A] to-[#1A1F2C] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {russianCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="absolute glass p-2 rounded-lg cursor-pointer hover:glow-box transition-all"
                        style={{
                          left: `${20 + (idx % 5) * 15}%`,
                          top: `${20 + Math.floor(idx / 5) * 25}%`
                        }}
                      >
                        <div className="text-xs font-semibold">{city.name}</div>
                        <div className="text-lg font-bold text-primary">{city.temp}°</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 glass p-4 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Легенда</div>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Холодно</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>Тепло</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Жарко</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="mt-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Температура и осадки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-end justify-around gap-2">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const temp = -5 + Math.sin(idx / 4) * 3;
                    const height = ((temp + 10) / 20) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                        <div className="text-xs text-muted-foreground">{Math.round(temp)}°</div>
                        <div
                          className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{idx}:00</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar" className="mt-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Метеорологический радар</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[400px] bg-gradient-to-br from-[#0A0E1A] to-[#1A1F2C] rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute border border-primary rounded-full animate-pulse-glow"
                        style={{
                          width: `${(idx + 1) * 20}%`,
                          height: `${(idx + 1) * 20}%`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          animationDelay: `${idx * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="relative z-10">
                    <Icon name="Radio" size={60} className="text-primary glow animate-pulse-glow" />
                  </div>
                  <div className="absolute top-4 right-4 glass p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Интенсивность</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-2 bg-green-500" />
                        <span>Слабая</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-2 bg-yellow-500" />
                        <span>Средняя</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-2 bg-red-500" />
                        <span>Сильная</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;