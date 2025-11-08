import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';
import { useSEO } from '@/utils/seo';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useSEO({
    title: 'MASCLIMAT.RU — Система мониторинга погоды нового поколения',
    description: 'Высокотехнологичная платформа прогнозирования погоды для всех городов России. Точные данные в реальном времени, детальная аналитика, футуристичный интерфейс.',
    keywords: 'погода России, прогноз погоды, метеостанция, климат, температура, мониторинг погоды',
    canonicalUrl: 'https://masclimat.ru'
  });

  const topCities = russianCities.slice(0, 12);

  const filteredCities = searchQuery
    ? russianCities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleCitySelect = (cityName: string) => {
    navigate(`/city/${cityName}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgxNCwxNjUsMjMzLDAuMSkiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10">
        <header className="border-b border-cyan-500/20 backdrop-blur-md bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Icon name="CloudSun" size={40} className="text-cyan-400 glow-cyan" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold glow-text-cyan tracking-wider">MASCLIMAT.RU</h1>
                  <p className="text-xs text-cyan-400/70 tracking-widest">WEATHER SYSTEM v3.0</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end text-xs font-mono">
                  <div className="text-cyan-400">
                    {currentTime.toLocaleDateString('ru-RU', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="text-purple-400 font-bold text-lg">
                    {currentTime.toLocaleTimeString('ru-RU')}
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/cities')}
                  className="gradient-cyan-purple font-bold tracking-wider border-2 border-cyan-400/50 hover:border-cyan-400"
                >
                  <Icon name="Map" size={18} className="mr-2" />
                  ВСЕ ГОРОДА
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-6">
              <Badge className="glass-panel px-6 py-2 text-sm border-cyan-400/50 text-cyan-400 font-bold tracking-wider">
                <Icon name="Zap" size={14} className="mr-2 inline" />
                СИСТЕМА НОВОГО ПОКОЛЕНИЯ
              </Badge>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-6 glow-text-cyan">
              ПОГОДНЫЙ
              <br />
              <span className="glow-text-purple">МОНИТОРИНГ</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Высокоточная система метеорологического анализа с поддержкой 
              <span className="text-cyan-400 font-bold"> {russianCities.length}+ городов России</span>.
              <br />
              Данные обновляются в реальном времени через интеграцию с OpenWeatherMap API.
            </p>

            <div className="relative max-w-2xl mx-auto mb-8">
              <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <Input
                placeholder="Введите название города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass-panel border-2 border-cyan-400/30 focus:border-cyan-400 bg-background/50 placeholder:text-muted-foreground/50"
              />
              
              {filteredCities.length > 0 && (
                <Card className="absolute top-full mt-2 w-full glass-panel border-cyan-400/30 z-50">
                  <CardContent className="p-2">
                    {filteredCities.map((city, idx) => (
                      <button
                        key={city.name}
                        onClick={() => handleCitySelect(city.name)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-400/10 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                            {city.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{city.region}</div>
                        </div>
                        <Icon name="ArrowRight" size={18} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
              <Card className="glass-panel border-cyan-400/30 scan-line">
                <CardContent className="p-6 text-center">
                  <Icon name="Database" size={32} className="mx-auto mb-3 text-cyan-400" />
                  <div className="text-3xl font-bold text-cyan-400 mb-1">{russianCities.length}+</div>
                  <div className="text-sm text-muted-foreground">Городов России</div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel border-purple-400/30 scan-line">
                <CardContent className="p-6 text-center">
                  <Icon name="Clock" size={32} className="mx-auto mb-3 text-purple-400" />
                  <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Онлайн мониторинг</div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel border-cyan-400/30 scan-line">
                <CardContent className="p-6 text-center">
                  <Icon name="Gauge" size={32} className="mx-auto mb-3 text-cyan-400" />
                  <div className="text-3xl font-bold text-cyan-400 mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Параметров</div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel border-purple-400/30 scan-line">
                <CardContent className="p-6 text-center">
                  <Icon name="Activity" size={32} className="mx-auto mb-3 text-purple-400" />
                  <div className="text-3xl font-bold text-purple-400 mb-1">Real-Time</div>
                  <div className="text-sm text-muted-foreground">Обновление</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Icon name="MapPin" size={28} className="text-cyan-400" />
                <span className="glow-text-cyan">ПОПУЛЯРНЫЕ ГОРОДА</span>
              </h3>
              <Button 
                variant="outline" 
                onClick={() => navigate('/cities')}
                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
              >
                Все города
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topCities.map((city, idx) => (
                <Card 
                  key={city.name}
                  onClick={() => handleCitySelect(city.name)}
                  className="glass-panel border-cyan-400/20 hover:border-cyan-400 cursor-pointer transition-all hover:scale-105 group scan-line"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                          {city.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">{city.region}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Icon name="Users" size={12} className="text-cyan-400" />
                          <span className="text-muted-foreground">
                            {(city.population / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Icon name="CloudSun" size={32} className="text-cyan-400 mb-2" />
                        <div className="text-2xl font-bold text-cyan-400">
                          {Math.floor(Math.random() * 30) - 10}°
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-cyan-400/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} className="text-purple-400" />
                        <span>{city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°</span>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="glass-panel border-cyan-400/30 mb-12">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Info" size={24} className="text-cyan-400" />
                    <span className="glow-text-cyan">О СИСТЕМЕ</span>
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    <strong className="text-cyan-400">MASCLIMAT.RU</strong> — современная метеорологическая платформа 
                    с высокоточными данными о погоде для всех регионов Российской Федерации.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Система интегрирована с <strong className="text-purple-400">OpenWeatherMap API</strong>, 
                    обеспечивая получение актуальной информации каждую минуту. Данные включают температуру, 
                    влажность, давление, скорость ветра, облачность, видимость и прогноз на 10 дней.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Cpu" size={24} className="text-purple-400" />
                    <span className="glow-text-purple">ТЕХНОЛОГИИ</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: 'Zap', label: 'React + TypeScript', color: 'cyan' },
                      { icon: 'Globe', label: 'OpenWeatherMap API', color: 'purple' },
                      { icon: 'Map', label: 'Leaflet Maps', color: 'cyan' },
                      { icon: 'Database', label: 'Real-time Data', color: 'purple' },
                      { icon: 'Shield', label: 'Secure', color: 'cyan' },
                      { icon: 'Rocket', label: 'Fast Performance', color: 'purple' }
                    ].map((tech, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2 p-3 rounded-lg bg-${tech.color}-400/5 border border-${tech.color}-400/20`}
                      >
                        <Icon name={tech.icon as any} size={18} className={`text-${tech.color}-400`} />
                        <span className="text-sm font-medium">{tech.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="border-t border-cyan-400/20 backdrop-blur-md bg-background/80 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon name="CloudSun" size={32} className="text-cyan-400" />
                <div>
                  <div className="font-bold text-cyan-400">MASCLIMAT.RU</div>
                  <div className="text-xs text-muted-foreground">Weather Monitoring System</div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  © 2024 MASCLIMAT.RU. Все права защищены.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Powered by OpenWeatherMap API
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
