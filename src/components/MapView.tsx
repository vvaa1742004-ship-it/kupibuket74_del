import { Box } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface MapPoint {
  lat: number;
  lon: number;
  label: string;
}

interface MapViewProps {
  points: MapPoint[];
  height?: number;
}

export default function MapView({ points, height = 240 }: MapViewProps) {
  if (!points.length) {
    return <Box className="map-fallback">Нет координат для карты</Box>;
  }

  const center = [points[0].lat, points[0].lon] as [number, number];

  return (
    <Box sx={{ overflow: "hidden", borderRadius: 3 }}>
      <MapContainer center={center} zoom={12} style={{ height, width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker key={`${point.label}-${point.lat}-${point.lon}`} position={[point.lat, point.lon]}>
            <Popup>{point.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}

