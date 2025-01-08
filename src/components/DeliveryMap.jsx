import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { icons, MapPinCheck, MapPinIcon, MapPinnedIcon } from 'lucide-react';

const createCustomIcon = (iconUrl, iconSize) => {
  return L.icon({
    iconUrl,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize]
  });
};

const pickupIcon = createCustomIcon('/location-line.svg', 30);
const deliveryIcon = createCustomIcon('/location.svg', 30);
const pickupLocation = [40.6234, -74.1368]; // Example: West New Brighton area
const deliveryLocation = [40.5651, -74.1140]; // Example: Fort Wadsworth area

const routeCoordinates = [
    pickupLocation, // West New Brighton
    deliveryLocation, // George Brighton Heights
  ];

const DeliveryMap = () => {
  /* const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); */

  const center = [40.6132, -74.1420]; // Default center for Staten Island
  const zoom = 13;

  /* useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/delivery-locations'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        setPickupLocation(data.pickupLocation);
        setDeliveryLocation(data.deliveryLocation);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []); */

  /* if (isLoading) return <div>Loading map...</div>;
  if (error) return <div>Error loading map: {error}</div>; */

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', zIndex: '5' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {pickupLocation && (
        <Marker position={pickupLocation} icon={pickupIcon} inter>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {deliveryLocation && (
        <Marker position={deliveryLocation} icon={deliveryIcon}>
          <Popup>Delivery Location</Popup>
        </Marker>
      )}
      <Polyline positions={routeCoordinates} color="#FF9800" weight={4} />
    </MapContainer>
  );
};

export default DeliveryMap