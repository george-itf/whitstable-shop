'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MobileWrapper from '@/components/layout/MobileWrapper';
import BottomNav from '@/components/layout/BottomNav';
import Badge from '@/components/ui/Badge';
import { CATEGORY_COLORS } from '@/lib/constants';

// Mock shops data
const mockShops = [
  { id: '1', name: 'Wheelers Oyster Bar', slug: 'wheelers-oyster-bar', lat: 51.3607, lng: 1.0253, category: 'oysters-seafood' },
  { id: '2', name: 'The Forge', slug: 'the-forge', lat: 51.3610, lng: 1.0260, category: 'restaurant-pub' },
  { id: '3', name: 'Harbour Books', slug: 'harbour-books', lat: 51.3608, lng: 1.0255, category: 'books-records' },
  { id: '4', name: "JoJo's", slug: 'jojos', lat: 51.3612, lng: 1.0248, category: 'fish-chips-takeaway' },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'oysters-seafood', name: 'Oysters' },
  { id: 'cafe-coffee', name: 'Café' },
  { id: 'restaurant-pub', name: 'Restaurant' },
  { id: 'fish-chips-takeaway', name: 'Takeaway' },
  { id: 'books-records', name: 'Books' },
];

// Whitstable center coordinates
const WHITSTABLE_CENTER: [number, number] = [1.0256, 51.3614];
const DEFAULT_ZOOM = 15;

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShop, setSelectedShop] = useState<typeof mockShops[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const filteredShops = selectedCategory === 'all'
    ? mockShops
    : mockShops.filter(shop => shop.category === selectedCategory);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Already initialized
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      setMapError('Mapbox API key not configured');
      return;
    }

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: WHITSTABLE_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
      });

      map.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-left'
      );

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map');
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when filtered shops change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredShops.forEach(shop => {
      const color = CATEGORY_COLORS[shop.category] || '#5BB5E0';

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'shop-marker';
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="${color}">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      `;
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([shop.lng, shop.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedShop(shop);
        map.current?.flyTo({
          center: [shop.lng, shop.lat],
          zoom: 16,
          duration: 500,
        });
      });

      markersRef.current.push(marker);
    });
  }, [filteredShops, mapLoaded]);

  return (
    <MobileWrapper>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-ink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-xl text-ink">map</h1>
        </div>

        {/* Category filters */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-pill text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-sky text-white'
                    : 'bg-grey-light text-grey-dark hover:bg-grey-light/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="h-screen relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Error state */}
        {mapError && (
          <div className="absolute inset-0 bg-sky-light flex items-center justify-center">
            <div className="bg-white rounded-card p-4 shadow-card text-center max-w-xs">
              <p className="text-grey">{mapError}</p>
              <p className="text-xs text-grey mt-2">
                Add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 bg-sky-light flex items-center justify-center">
            <div className="text-grey">Loading map...</div>
          </div>
        )}

        {/* Selected shop card */}
        {selectedShop && (
          <div className="absolute bottom-24 left-4 right-4 bg-white rounded-card shadow-card overflow-hidden z-20">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-ink">{selectedShop.name}</h3>
                  <Badge variant="default" size="sm" className="mt-1">
                    {selectedShop.category.replace(/-/g, ' ')}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedShop(null)}
                  className="p-1 text-grey hover:text-ink"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Link
                href={`/shops/${selectedShop.slug}`}
                className="mt-3 block w-full py-2 bg-sky text-white text-center rounded-button font-semibold"
              >
                View shop
              </Link>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileWrapper>
  );
}
