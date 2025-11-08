import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';

const CityWeather = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const city = russianCities.find(c => c.name === cityName);

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1A1F2C] to-[#0F1419] p-8 flex items-center justify-center">
        <Card className="glass border-0">
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

  const mockTemp = Math.floor(Math.random() * 30) - 15;
  const mockHumidity = Math.floor(Math.random() * 40) + 50;
  const mockPressure = Math.floor(Math.random() * 30) + 995;
  const mockWind = Math.floor(Math.random() * 15) + 2;
  const mockClouds = Math.floor(Math.random() * 100);
  const mockVisibility = Math.floor(Math.random() * 10) + 5;
  const mockUV = Math.floor(Math.random() * 11);
  const mockDewPoint = mockTemp - 5;
  const mockFeelsLike = mockTemp - 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1A1F2C] to-[#0F1419] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" className="glass">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              На главную
            </Button>
          </Link>
          <Link to="/cities">
            <Button variant="ghost" className="glass">
              Все города
            </Button>
          </Link>
        </div>

        <header className="glass rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary glow">{city.name}</h1>
              <p className="text-muted-foreground mt-2">{city.region} • Население: {(city.population / 1000).toFixed(0)}K</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={16} />
                <span>{city.lat.toFixed(4)}° N, {city.lon.toFixed(4)}° E</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xl px-6 py-2">
              {mockClouds > 70 ? 'Облачно' : mockClouds > 30 ? 'Переменная облачность' : 'Ясно'}
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl">Текущая погода</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <Icon name={mockClouds > 70 ? 'Cloud' : mockClouds > 30 ? 'CloudSun' : 'Sun'} size={100} className="text-primary" />
                <div>
                  <div className="text-8xl font-bold glow">{mockTemp}°</div>
                  <div className="text-muted-foreground mt-2 text-lg">
                    Ощущается как {mockFeelsLike}°
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="glass p-4 rounded-xl text-center hover:glow-box transition-all">
                  <Icon name="Droplets" size={28} className="mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold">{mockHumidity}%</div>
                  <div className="text-xs text-muted-foreground mt-2">Влажность</div>
                </div>
                <div className="glass p-4 rounded-xl text-center hover:glow-box transition-all">
                  <Icon name="Gauge" size={28} className="mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold">{mockPressure}</div>
                  <div className="text-xs text-muted-foreground mt-2">мм рт.ст.</div>
                </div>
                <div className="glass p-4 rounded-xl text-center hover:glow-box transition-all">
                  <Icon name="Wind" size={28} className="mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold">{mockWind}</div>
                  <div className="text-xs text-muted-foreground mt-2">м/с</div>
                </div>
                <div className="glass p-4 rounded-xl text-center hover:glow-box transition-all">
                  <Icon name="Eye" size={28} className="mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold">{mockVisibility}</div>
                  <div className="text-xs text-muted-foreground mt-2">км</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} />
                Дополнительно
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="glass p-4 rounded-lg">
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

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Облачность</span>
                  <span className="font-bold">{mockClouds}%</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Точка росы</span>
                  <span className="font-bold">{mockDewPoint}°C</span>
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">УФ индекс</span>
                  <Badge variant={mockUV > 7 ? 'destructive' : mockUV > 3 ? 'default' : 'secondary'}>
                    {mockUV} / 10
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon name="Thermometer" size={16} />
                Температура
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold glow">{mockTemp}°C</div>
              <div className="text-xs text-muted-foreground mt-1">Мин: {mockTemp - 3}° • Макс: {mockTemp + 2}°</div>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon name="CloudRain" size={16} />
                Осадки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0 мм</div>
              <div className="text-xs text-muted-foreground mt-1">За последний час</div>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon name="Navigation" size={16} />
                Направление ветра
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">СЗ</div>
              <div className="text-xs text-muted-foreground mt-1">330° азимут</div>
            </CardContent>
          </Card>

          <Card className="glass border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon name="Waves" size={16} />
                Атмосферное давление
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockPressure}</div>
              <div className="text-xs text-muted-foreground mt-1">мм рт. ст.</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Почасовой прогноз на 24 часа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {Array.from({ length: 24 }).map((_, idx) => {
                const hourTemp = mockTemp + Math.sin(idx / 3) * 4;
                return (
                  <div key={idx} className="glass p-4 rounded-lg min-w-[100px] text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      {String(idx).padStart(2, '0')}:00
                    </div>
                    <Icon 
                      name={idx >= 6 && idx <= 18 ? 'Sun' : 'Moon'} 
                      size={32} 
                      className="mx-auto mb-2 text-primary" 
                    />
                    <div className="text-xl font-bold">{Math.round(hourTemp)}°</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {Math.floor(Math.random() * 15) + 5} м/с
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Прогноз на 10 дней</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, idx) => {
                const dayTemp = mockTemp + Math.sin(idx) * 5;
                const date = new Date();
                date.setDate(date.getDate() + idx);
                return (
                  <div key={idx} className="glass p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <div className="font-semibold">
                          {idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <Icon name={idx % 3 === 0 ? 'CloudRain' : idx % 2 === 0 ? 'Cloud' : 'Sun'} size={28} className="text-primary" />
                      <span className="text-sm text-muted-foreground w-32">
                        {idx % 3 === 0 ? 'Дождь' : idx % 2 === 0 ? 'Облачно' : 'Ясно'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Осадки</div>
                        <div className="font-semibold">{idx % 3 === 0 ? '80%' : '10%'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{Math.round(dayTemp - 3)}°</span>
                        <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
                        <span className="font-bold text-xl">{Math.round(dayTemp + 2)}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CityWeather;
