import dynamic from "next/dynamic";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const MapViewController: React.FC<{
  position: [number, number];
  initialZoom: number;
  onNavigateToCurrent: () => void;
  isSatellite: boolean;
  setIsSatellite: (value: boolean) => void;
}> = ({ position, initialZoom, onNavigateToCurrent, isSatellite, setIsSatellite }) => {
  const map = useMap();
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  // Load Leaflet dynamically on the client side
  useEffect(() => {
    import("leaflet").then((leafletModule) => {
      setL(leafletModule.default);
    });
  }, []);

  // Update map view whenever position changes
  useEffect(() => {
    if (map) {
      map.setView(position, initialZoom, { animate: true });
    }
  }, [map, position, initialZoom]);

  // Manage custom controls and layers
  useEffect(() => {
    if (!L) return; // Wait until Leaflet is loaded

    // Move attribution to bottomleft to avoid overlap with custom controls
    map.attributionControl.setPosition("bottomleft");

    const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    });
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri", maxZoom: 19 }
    );

    // Set the initial layer based on isSatellite
    if (isSatellite) {
      satelliteLayer.addTo(map);
    } else {
      streetLayer.addTo(map);
    }

    const CustomControl = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create("div", "leaflet-control-custom-container");
        container.style.display = "flex";
        container.style.flexDirection = "row";
        container.style.gap = "8px";
        container.style.backgroundColor = "white";
        container.style.padding = "5px";
        container.style.borderRadius = "4px";
        container.style.boxShadow = "0 1px 5px rgba(0,0,0,0.2)";
        container.style.zIndex = "1000"; // Ensure controls are in the foreground
        container.style.marginBottom = "20px"; // Add space for mobile nav bar
        container.style.marginRight = "10px";

        // Current Location Button
        const locationBtn = L.DomUtil.create("div", "leaflet-control-custom-button", container);
        locationBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="12" y1="2" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="22" y2="12"></line>
          </svg>
        `;
        locationBtn.style.cursor = "pointer";
        locationBtn.style.padding = "4px";
        locationBtn.style.zIndex = "1000";
        locationBtn.title = "Navigate to Current Location";
        locationBtn.setAttribute("aria-label", "Navigate to Current Location");
        locationBtn.onclick = () => onNavigateToCurrent();

        // Satellite Toggle Button
        const satelliteBtn = L.DomUtil.create("div", "leaflet-control-custom-button", container);
        satelliteBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 9 12 2 21 9 12 16 3 9"></polygon>
            <path d="M21 14l-9 7-9-7"></path>
          </svg>
        `;
        satelliteBtn.style.cursor = "pointer";
        satelliteBtn.style.padding = "4px";
        satelliteBtn.style.zIndex = "1000";
        satelliteBtn.title = "Toggle Satellite View";
        satelliteBtn.setAttribute("aria-label", "Toggle Satellite View");
        satelliteBtn.style.backgroundColor = isSatellite ? "#e0e0e0" : "white";

        satelliteBtn.onclick = () => {
          if (isSatellite) {
            map.removeLayer(satelliteLayer);
            map.addLayer(streetLayer);
          } else {
            map.removeLayer(streetLayer);
            map.addLayer(satelliteLayer);
          }
          setIsSatellite(!isSatellite);
        };

        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });

    const control = new CustomControl({ position: "bottomright" });
    map.addControl(control);

    return () => {
      map.removeControl(control);
      map.removeLayer(streetLayer);
      map.removeLayer(satelliteLayer);
    };
  }, [map, onNavigateToCurrent, isSatellite, setIsSatellite, L]);

  return null;
};

interface MapProps {
  currentPosition: [number, number] | null;
  setCurrentPosition: (position: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ currentPosition, setCurrentPosition }) => {
  const position: [number, number] = currentPosition || [25.7617, -80.1918]; // Miami fallback
  const initialZoom: number = 19;
  const [isSatellite, setIsSatellite] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  // Load Leaflet dynamically on the client side
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  useEffect(() => {
    import("leaflet").then((leafletModule) => {
      setL(leafletModule.default);
    });
  }, []);

  // Define customMarkerIcon only after Leaflet is loaded
  const customMarkerIcon = L?.icon({
    iconUrl: "/fishly_logo_white_fill.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  // Function to fetch city and state from latitude and longitude using Nominatim API
  const fetchCityState = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "FishlyApp/1.0 (your-email@example.com)", // Replace with your app details
          },
        }
      );
      const data = await response.json();
      if (data && data.address) {
        console.log(data);
        const city =
          data.address.city ||
          data.address.village ||
          data.address.hamlet ||
          data.address.suburb ||
          "Unknown City";
        const state = data.address.state || "Unknown State";
        setLocationName(`${city}, ${state}`);
      } else {
        setLocationName("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching city/state:", error);
      setLocationName("Unknown Location");
    }
  };

  // Fetch city and state whenever position changes
  useEffect(() => {
    if (currentPosition) {
      fetchCityState(currentPosition[0], currentPosition[1]);
    } else {
      // Fallback position (Miami)
      fetchCityState(25.7617, -80.1918);
    }
  }, [currentPosition]);

  const navigateToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}`);
          alert("Unable to retrieve your location. Using the last known position.");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={position}
        zoom={initialZoom}
        maxZoom={19}
        className="h-[52vh] md:h-[70vh] w-full mx-auto"
        style={{ minHeight: "300px", zIndex: 1 }}
      >
        <TileLayer
          url={
            isSatellite
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution={
            isSatellite
              ? "© Esri"
              : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          maxZoom={19}
        />
        <MapViewController
          position={position}
          initialZoom={initialZoom}
          onNavigateToCurrent={navigateToCurrentLocation}
          isSatellite={isSatellite}
          setIsSatellite={setIsSatellite}
        />
        {customMarkerIcon && (
          <Marker position={position} icon={customMarkerIcon}>
            <Popup>
              <div className="p-2 max-w-xs justify-center items-center text-center mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {locationName || "Miami, FL"}
                </h3>
                <Image
                  src="/fishly_logo_white_fill.png"
                  alt="Fishly Logo"
                  width={125}
                  height={125}
                  priority
                  style={{margin: "auto"}}
                />
                <p className="font-semibold text-[14px] text-gray-700 dark:text-gray-300">
                  {"Now that's a keeper!"}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;