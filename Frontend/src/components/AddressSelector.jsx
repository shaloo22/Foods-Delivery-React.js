import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';

const AddressSelector = ({ onAddressSelect }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const [position, setPosition] = useState([28.6139, 77.2090]); // Default to Delhi
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        // Initialize Map
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView(position, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);

            // Click listener
            mapRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                updateLocation(lat, lng);
            });

            // Initial Marker
            markerRef.current = L.marker(position).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const updateLocation = (lat, lng) => {
        const newPos = [lat, lng];
        setPosition(newPos);
        if (markerRef.current) {
            markerRef.current.setLatLng(newPos);
        }
        if (mapRef.current) {
            mapRef.current.setView(newPos, mapRef.current.getZoom());
        }
        fetchAddress(lat, lng);
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();

            const addr = data.display_name;
            const cityArr = data.address.city || data.address.town || data.address.village || data.address.state_district || '';
            const pc = data.address.postcode || '';

            setAddress(addr);
            setCity(cityArr);
            setPincode(pc);

            onAddressSelect({
                address: addr,
                city: cityArr,
                pincode: pc,
                lat,
                lng
            });
        } catch (error) {
            console.error("Geocoding failed", error);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    updateLocation(latitude, longitude);
                    setLocating(false);
                },
                (err) => {
                    console.error(err);
                    setLocating(false);
                    alert("Could not get your location. Please select on map.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700">Select Delivery Location</label>
                <button
                    onClick={handleGetCurrentLocation}
                    type="button"
                    disabled={locating}
                    className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all shadow-sm
                        ${locating
                            ? "bg-gray-100 text-gray-400"
                            : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"}`}
                >
                    <FaLocationArrow className={locating ? "animate-spin" : ""} />
                    {locating ? "Locating..." : "Use Current Location"}
                </button>
            </div>

            <div className="rounded-3xl overflow-hidden border-2 border-orange-100 shadow-sm relative z-0 h-[220px]">
                <div ref={mapContainerRef} className="h-full w-full" style={{ minHeight: '220px' }} />
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-4 text-orange-400" />
                    <textarea
                        placeholder="Detailed Address (House No, Building, Street)"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            onAddressSelect({ address: e.target.value, city, pincode, lat: position[0], lng: position[1] });
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[80px]"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            onAddressSelect({ address, city: e.target.value, pincode, lat: position[0], lng: position[1] });
                        }}
                        className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 font-bold"
                        required
                    />
                    <input
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => {
                            setPincode(e.target.value);
                            onAddressSelect({ address, city, pincode: e.target.value, lat: position[0], lng: position[1] });
                        }}
                        className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressSelector;
