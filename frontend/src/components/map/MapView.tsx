"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Billboard } from "@/features/billboards/types";

// Leaflet's default marker icons reference image URLs that break under bundlers; point them at a CDN instead.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DEFAULT_CENTER: [number, number] = [6.1319, 1.2228]; // Lome, Togo - default AdSpace Market market
const DEFAULT_ZOOM = 6;

function FitToMarkers({ billboards }: { billboards: Billboard[] }) {
  const map = useMap();

  useEffect(() => {
    if (billboards.length === 0) return;
    const bounds = L.latLngBounds(billboards.map((b) => [b.latitude, b.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [billboards, map]);

  return null;
}

export default function MapView({
  billboards,
  selectedId,
  onSelect,
}: {
  billboards: Billboard[];
  selectedId?: string;
  onSelect?: (billboard: Billboard) => void;
}) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToMarkers billboards={billboards} />
      {billboards.map((billboard) => (
        <Marker
          key={billboard.id}
          position={[billboard.latitude, billboard.longitude]}
          icon={markerIcon}
          eventHandlers={{ click: () => onSelect?.(billboard) }}
          opacity={selectedId === billboard.id ? 1 : 0.85}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{billboard.title}</p>
              <p>{billboard.city}, {billboard.country}</p>
              <p>
                {billboard.monthlyPrice} {billboard.currency} / mois
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
