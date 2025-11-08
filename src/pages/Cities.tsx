import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { russianCities } from '@/data/cities';

const Cities = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = Array.from(new Set(russianCities.map(c => c.region))).sort();
  
  const filteredCities = russianCities
    .filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
                           city.region.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = !selectedRegion || city.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => b.population - a.population);

  const mockTemps = filteredCities.map(() => Math.floor(Math.random() * 30) - 15);

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
        </div>

        <header className="glass rounded-2xl p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary glow">Города России</h1>
              <p className="text-muted-foreground mt-2">
                {filteredCities.length} городов с детальной погодной информацией
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Map" size={24} className="text-primary" />
              <span className="text-2xl font-bold">{regions.length}</span>
              <span className="text-muted-foreground">регионов</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="glass border-0 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Filter" size={20} />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Поиск города</label>
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Москва, Санкт-Петербург..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 glass border-0"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-muted-foreground">Регионы</label>
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
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region === selectedRegion ? null : region)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                        selectedRegion === region
                          ? 'glass border-2 border-primary text-primary font-semibold'
                          : 'hover:bg-muted/10'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
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
              {filteredCities.map((city, idx) => (
                <Link key={city.name} to={`/city/${city.name}`}>
                  <Card className="glass border-0 hover:glow-box transition-all cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{city.region}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="Users" size={12} />
                              <span>{(city.population / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="MapPin" size={12} />
                              <span>{city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold glow text-primary">
                            {mockTemps[idx]}°
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {mockTemps[idx] > 20 ? 'Жарко' : mockTemps[idx] > 10 ? 'Тепло' : mockTemps[idx] > 0 ? 'Прохладно' : 'Холодно'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                        <div className="text-center">
                          <Icon name="Droplets" size={14} className="mx-auto mb-1 text-primary" />
                          <div className="text-xs font-semibold">{Math.floor(Math.random() * 40) + 50}%</div>
                        </div>
                        <div className="text-center">
                          <Icon name="Wind" size={14} className="mx-auto mb-1 text-primary" />
                          <div className="text-xs font-semibold">{Math.floor(Math.random() * 15) + 2} м/с</div>
                        </div>
                        <div className="text-center">
                          <Icon name="Gauge" size={14} className="mx-auto mb-1 text-primary" />
                          <div className="text-xs font-semibold">{Math.floor(Math.random() * 30) + 995}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <Card className="glass border-0">
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
      </div>
    </div>
  );
};

export default Cities;
