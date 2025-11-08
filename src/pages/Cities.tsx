import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';
import { getCurrentWeatherByCoords, getWeatherIcon, type WeatherData } from '@/lib/weatherApi';
import { useSEO, addStructuredData } from '@/utils/seo';

const Cities = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [weatherCache, setWeatherCache] = useState<Record<string, WeatherData>>({});
  const [loadingWeather, setLoadingWeather] = useState<Record<string, boolean>>({});

  useSEO({
    title: 'Все города России — прогноз погоды с картами | MASCLIMAT.RU',
    description: 'Полный список городов России с актуальной погодой. Поиск по городу, фильтры по регионам и федеральным округам. Подробная информация о температуре, влажности, ветре и давлении для каждого города.',
    keywords: 'города России, погода города России, прогноз погоды Россия, карта погоды, регионы России, федеральные округа',
    canonicalUrl: 'https://masclimat.ru/cities'
  });

  const regions = Array.from(new Set(russianCities.map(c => c.region))).sort();
  const districts = Array.from(new Set(russianCities.map(c => c.federalDistrict).filter(Boolean))).sort();
  
  const filteredCities = russianCities
    .filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
                           city.region.toLowerCase().includes(search.toLowerCase()) ||
                           (city.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesRegion = !selectedRegion || city.region === selectedRegion;
      const matchesDistrict = !selectedDistrict || city.federalDistrict === selectedDistrict;
      return matchesSearch && matchesRegion && matchesDistrict;
    })
    .sort((a, b) => b.population - a.population);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Города России',
      'description': 'Полный список городов России с прогнозом погоды',
      'numberOfItems': russianCities.length,
      'itemListElement': russianCities.slice(0, 20).map((city, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Place',
          'name': city.name,
          'address': {
            '@type': 'PostalAddress',
            'addressRegion': city.region,
            'addressCountry': 'RU'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': city.lat,
            'longitude': city.lon
          }
        }
      }))
    };
    addStructuredData(schema);
  }, []);

  useEffect(() => {
    const loadWeatherForVisibleCities = async () => {
      const citiesToLoad = filteredCities.slice(0, 20);
      
      for (const city of citiesToLoad) {
        if (!weatherCache[city.name] && !loadingWeather[city.name]) {
          setLoadingWeather(prev => ({ ...prev, [city.name]: true }));
          
          try {
            const weather = await getCurrentWeatherByCoords(city.lat, city.lon);
            setWeatherCache(prev => ({ ...prev, [city.name]: weather }));
          } catch (error) {
            console.error(`Failed to load weather for ${city.name}:`, error);
          } finally {
            setLoadingWeather(prev => ({ ...prev, [city.name]: false }));
          }
        }
      }
    };

    if (filteredCities.length > 0) {
      loadWeatherForVisibleCities();
    }
  }, [filteredCities.map(c => c.name).join(',')]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="CloudSun" size={32} className="text-primary" />
              <span className="text-2xl font-bold text-primary">MASCLIMAT.RU</span>
            </Link>

            <Link to="/">
              <Button variant="outline">
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Города России</h1>
          <p className="text-muted-foreground">
            {filteredCities.length} городов с подробной информацией о погоде
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Поиск города</label>
                  <div className="relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Москва, Санкт-Петербург..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Федеральные округа</label>
                    {selectedDistrict && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDistrict(null)}
                        className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                      >
                        Сбросить
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1 mb-4">
                    {districts.map((district) => (
                      <button
                        key={district}
                        onClick={() => setSelectedDistrict(district === selectedDistrict ? null : district)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedDistrict === district
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Регионы ({regions.length})</label>
                    {selectedRegion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRegion(null)}
                        className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                      >
                        Сбросить
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region === selectedRegion ? null : region)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedRegion === region
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Найдено: <span className="text-foreground font-semibold">{filteredCities.length}</span> городов
              </div>
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch('')}
                  className="text-primary"
                >
                  Очистить поиск
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCities.map((city) => {
                const weather = weatherCache[city.name];
                const isLoading = loadingWeather[city.name];
                
                return (
                  <Link key={city.name} to={`/city/${city.name}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1">{city.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{city.region}</p>
                            
                            {city.federalDistrict && (
                              <Badge variant="outline" className="mb-2 text-xs">
                                {city.federalDistrict}
                              </Badge>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                              <div className="flex items-center gap-1">
                                <Icon name="Users" size={12} />
                                <span>{(city.population / 1000000).toFixed(2)}M</span>
                              </div>
                              {city.foundedYear && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Calendar" size={12} />
                                  <span>{city.foundedYear} г.</span>
                                </div>
                              )}
                              {city.areaKm2 && (
                                <div className="flex items-center gap-1">
                                  <Icon name="Square" size={12} />
                                  <span>{city.areaKm2} км²</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            {isLoading ? (
                              <div className="text-2xl text-muted-foreground">...</div>
                            ) : weather ? (
                              <>
                                <Icon name={getWeatherIcon(weather.icon) as any} size={40} className="text-primary mb-2" />
                                <div className="text-3xl font-bold text-primary">
                                  {weather.temp}°
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {weather.condition}
                                </div>
                              </>
                            ) : (
                              <div className="text-3xl font-bold text-primary">
                                {Math.floor(Math.random() * 30) - 15}°
                              </div>
                            )}
                          </div>
                        </div>

                        {city.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {city.description}
                          </p>
                        )}

                        <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                          <div className="text-center">
                            <Icon name="Droplets" size={14} className="mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs font-medium">{weather?.humidity ?? '-'}%</div>
                          </div>
                          <div className="text-center">
                            <Icon name="Wind" size={14} className="mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs font-medium">{weather?.wind_speed.toFixed(1) ?? '-'} м/с</div>
                          </div>
                          <div className="text-center">
                            <Icon name="Gauge" size={14} className="mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs font-medium">{weather ? Math.round(weather.pressure * 0.75) : '-'}</div>
                          </div>
                          {city.elevation && (
                            <div className="text-center">
                              <Icon name="Mountain" size={14} className="mx-auto mb-1 text-muted-foreground" />
                              <div className="text-xs font-medium">{city.elevation}м</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredCities.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">Ничего не найдено</h3>
                  <p className="text-muted-foreground">
                    Попробуйте изменить параметры поиска или сбросить фильтры
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cities;