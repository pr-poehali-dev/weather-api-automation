import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
                  <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCities.map((city, idx) => (
                <Link key={city.name} to={`/city/${city.name}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{city.region}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Users" size={12} />
                            <span>{(city.population / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">
                            {mockTemps[idx]}°
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                        <div className="text-center">
                          <Icon name="Droplets" size={14} className="mx-auto mb-1 text-muted-foreground" />
                          <div className="text-xs font-medium">{Math.floor(Math.random() * 40) + 50}%</div>
                        </div>
                        <div className="text-center">
                          <Icon name="Wind" size={14} className="mx-auto mb-1 text-muted-foreground" />
                          <div className="text-xs font-medium">{Math.floor(Math.random() * 15) + 2} м/с</div>
                        </div>
                        <div className="text-center">
                          <Icon name="Gauge" size={14} className="mx-auto mb-1 text-muted-foreground" />
                          <div className="text-xs font-medium">{Math.floor(Math.random() * 30) + 995}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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