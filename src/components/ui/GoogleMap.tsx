import React, { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/context';

interface GoogleMapProps {
  apiKey: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markerTitle?: string;
}

export function GoogleMap({ 
  apiKey, 
  latitude = 36.8065, // Tunis par défaut
  longitude = 10.1815, 
  zoom = 13,
  markerTitle = 'SBS VISION'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();
  const isLoaded = useRef(false);

  useEffect(() => {
    // Charger le script Google Maps dynamiquement
    if (!window.google || !isLoaded.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initMap();
        isLoaded.current = true;
      };
      
      script.onerror = () => {
        console.error('Erreur lors du chargement de Google Maps API');
      };
      
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Nettoyage si nécessaire
    };
  }, [apiKey, latitude, longitude, zoom]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const position = { lat: latitude, lng: longitude };

    // Créer la carte
    const map = new window.google.maps.Map(mapRef.current, {
      center: position,
      zoom: zoom,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#101318' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#232934' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text',
          stylers: [{ color: '#9CA3AF' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#08090C' }]
        }
      ]
    });

    // Ajouter un marqueur
    new window.google.maps.Marker({
      position: position,
      map: map,
      title: markerTitle,
      animation: window.google.maps.Animation.DROP
    });

    // Ajouter une fenêtre d'info
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; color: #000;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${markerTitle}</h3>
          <p style="font-size: 12px;">${locale === 'ar' ? 'تونس - حلول أمنية متكاملة' : 'Tunisie - Solutions de Sécurité'}</p>
          <p style="font-size: 11px; color: #E11D2A;">+216 54 306 506</p>
        </div>
      `
    });

    infoWindow.open(map);
  };

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-xl border border-[#232934]"
        style={{ minHeight: '400px' }}
      />
      {!isLoaded.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#101318] rounded-xl border border-[#232934]">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#E11D2A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#9CA3AF]">
              {locale === 'ar' ? 'جاري تحميل الخريطة...' : 'Chargement de la carte...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
