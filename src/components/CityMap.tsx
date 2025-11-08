import { useEffect, useRef } from 'react';

interface CityMapProps {
  lat: number;
  lon: number;
  cityName: string;
  zoom?: number;
}

const CityMap = ({ lat, lon, cityName, zoom = 11 }: CityMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}&layer=mapnik&marker=${lat},${lon}`;

    mapRef.current.innerHTML = `
      <div class="relative w-full h-full">
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="${osmUrl}"
          style="border: 0; border-radius: 0.5rem;"
        ></iframe>
        <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-10 pointer-events-none">
          <div class="font-bold text-sm">${cityName}</div>
          <div class="text-xs text-muted-foreground">${lat.toFixed(4)}°, ${lon.toFixed(4)}°</div>
        </div>
      </div>
    `;
  }, [lat, lon, cityName, zoom]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-secondary/20"
    />
  );
};

export default CityMap;