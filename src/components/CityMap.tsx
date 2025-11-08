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

    const apiKey = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lon},${lat})/${lon},${lat},${zoom},0/600x400@2x?access_token=${apiKey}`;

    mapRef.current.innerHTML = `
      <div class="relative w-full h-full">
        <img 
          src="${mapboxUrl}" 
          alt="Карта ${cityName}"
          class="w-full h-full object-cover rounded-lg"
        />
        <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
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
