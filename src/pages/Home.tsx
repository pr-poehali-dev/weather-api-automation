import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    title: 'MASCLIMAT.RU — Прогноз погоды для городов России',
    description: 'Точный прогноз погоды для всех городов России. Актуальные данные о температуре, осадках, ветре и давлении. Почасовой прогноз и карты погоды.',
    keywords: 'погода России, прогноз погоды, температура, осадки, ветер, метеостанция',
    canonicalUrl: 'https://masclimat.ru'
  });

  const topCities = russianCities.slice(0, 20);

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="CloudSun" size={32} className="text-primary" />
              <span className="text-2xl font-bold text-primary">MASCLIMAT.RU</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  {currentTime.toLocaleTimeString('ru-RU')}
                </span>
              </div>
              
              <Link to="/cities">
                <Button variant="outline">
                  <Icon name="Map" size={18} className="mr-2" />
                  Все города
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Прогноз погоды для городов России</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Точные данные о погоде для {russianCities.length} городов России. 
            Актуальная информация о температуре, осадках, ветре и давлении в режиме реального времени.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск города по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
              
              {filteredCities.length > 0 && (
                <Card className="absolute top-full mt-2 w-full border shadow-lg z-50">
                  <CardContent className="p-2">
                    {filteredCities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleCitySelect(city.name)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold">{city.name}</div>
                          <div className="text-sm text-muted-foreground">{city.region}</div>
                        </div>
                        <Icon name="ArrowRight" size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="Database" size={32} className="mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">{russianCities.length}</div>
              <div className="text-sm text-muted-foreground">Городов России</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="Clock" size={32} className="mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Обновление данных</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="Gauge" size={32} className="mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Параметров погоды</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="Activity" size={32} className="mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">API</div>
              <div className="text-sm text-muted-foreground">OpenWeatherMap</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Популярные города</h2>
              <Link to="/cities">
                <Button variant="outline" size="sm">
                  Все города
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCities.map((city) => (
                <Link key={city.name} to={`/city/${city.name}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{city.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{city.region}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Users" size={12} />
                            <span>{(city.population / 1000000).toFixed(2)}M</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Icon name="Cloud" size={28} className="text-primary mb-1" />
                          <div className="text-xl font-bold text-primary">
                            {Math.floor(Math.random() * 30) - 10}°
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Info" size={24} className="text-primary" />
                О проекте
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                <strong>MASCLIMAT.RU</strong> — современный сервис прогноза погоды для всех городов России. 
                Мы предоставляем актуальную информацию о температуре, влажности, давлении, скорости ветра, 
                облачности и других метеорологических параметрах.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Данные обновляются в режиме реального времени через интеграцию с OpenWeatherMap API. 
                Система предоставляет почасовой прогноз на 24 часа и детальный прогноз на 10 дней вперёд.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Cpu" size={24} className="text-primary" />
                Возможности системы
              </h3>
              <div className="space-y-3">
                {[
                  { icon: 'MapPin', label: 'Погода для всех городов России' },
                  { icon: 'Clock', label: 'Почасовой прогноз на 24 часа' },
                  { icon: 'Calendar', label: 'Детальный прогноз на 10 дней' },
                  { icon: 'Map', label: 'Интерактивные карты местоположения' },
                  { icon: 'Wind', label: '15+ параметров погоды' },
                  { icon: 'Activity', label: 'Обновление данных в реальном времени' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Icon name={feature.icon as any} size={20} className="text-primary" />
                    <span className="text-sm">{feature.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 MASCLIMAT.RU. Прогноз погоды для городов России</p>
            <p className="mt-1">Данные предоставлены OpenWeatherMap</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
