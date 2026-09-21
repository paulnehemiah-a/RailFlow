import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  Train as TrainIcon,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Navigation,
  Check,
  Zap,
  Wrench,
  Maximize2,
  ShieldCheck,
  Compass,
  Layers,
  MapPin,
  Clock,
  Info,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';
import { Station, Train, Section } from '../../types';
import { TrainDetailDrawer } from '../shared/TrainDetailDrawer';

// Station geographical coordinates along the Southern Railway Chord Line (MS -> MDU)
export const SR_STATIONS_GEO = [
  { id: 'MS', code: 'MS', name: 'Chennai Egmore', km: 0, lat: 13.0827, lng: 80.2707, isMajor: true },
  { id: 'TBM', code: 'TBM', name: 'Tambaram', km: 25, lat: 12.9249, lng: 80.1275, isMajor: false },
  { id: 'CGL', code: 'CGL', name: 'Chengalpattu Jn', km: 56, lat: 12.6939, lng: 79.9757, isMajor: true },
  { id: 'TMV', code: 'TMV', name: 'Tindivanam', km: 122, lat: 12.2312, lng: 79.6548, isMajor: false },
  { id: 'VM', code: 'VM', name: 'Villupuram Jn', km: 159, lat: 11.9398, lng: 79.4939, isMajor: true },
  { id: 'VRI', code: 'VRI', name: 'Vriddhachalam Jn', km: 213, lat: 11.5204, lng: 79.3324, isMajor: true },
  { id: 'ALU', code: 'ALU', name: 'Ariyalur', km: 267, lat: 11.1396, lng: 79.0768, isMajor: false },
  { id: 'SRGM', code: 'SRGM', name: 'Srirangam', km: 325, lat: 10.8624, lng: 78.6997, isMajor: false },
  { id: 'TPJ', code: 'TPJ', name: 'Tiruchchirappalli Jn', km: 336, lat: 10.7905, lng: 78.6908, isMajor: true },
  { id: 'MPA', code: 'MPA', name: 'Manaparai', km: 373, lat: 10.6074, lng: 78.4168, isMajor: false },
  { id: 'DG', code: 'DG', name: 'Dindigul Jn', km: 430, lat: 10.3673, lng: 77.9803, isMajor: true },
  { id: 'SDN', code: 'SDN', name: 'Sholavandan', km: 472, lat: 10.0215, lng: 78.0121, isMajor: false },
  { id: 'MDU', code: 'MDU', name: 'Madurai Jn', km: 497, lat: 9.9252, lng: 78.1198, isMajor: true },
];

// Full track geometry coordinates with smooth realistic chord line route curves
const CORRIDOR_POLYLINE: [number, number][] = [
  [13.0827, 80.2707], // Chennai Egmore (MS)
  [13.0067, 80.2023], // Guindy
  [12.9249, 80.1275], // Tambaram (TBM)
  [12.8342, 80.0418], // Vandalur
  [12.6939, 79.9757], // Chengalpattu (CGL)
  [12.4820, 79.8240], // Madurantakam
  [12.3500, 79.7400], // Melmaruvathur
  [12.2312, 79.6548], // Tindivanam (TMV)
  [12.0500, 79.5600], // Vikravandi
  [11.9398, 79.4939], // Villupuram Jn (VM)
  [11.7500, 79.4100], // Ulundurpet
  [11.5204, 79.3324], // Vriddhachalam Jn (VRI)
  [11.3300, 79.2000], // Pennadam
  [11.1396, 79.0768], // Ariyalur (ALU)
  [10.9650, 78.8838], // Lalgudi
  [10.8624, 78.6997], // Srirangam (SRGM)
  [10.7905, 78.6908], // Tiruchchirappalli Jn (TPJ)
  [10.6074, 78.4168], // Manaparai (MPA)
  [10.4600, 78.1900], // Vadamadura
  [10.3673, 77.9803], // Dindigul Jn (DG)
  [10.1500, 78.0000], // Vadipatti
  [10.0215, 78.0121], // Sholavandan (SDN)
  [9.9252, 78.1198],  // Madurai Jn (MDU)
];

// Focus Section: Villupuram (VM) to Vriddhachalam (VRI)
const BLOCK_SECTION_POLYLINE: [number, number][] = [
  [11.9398, 79.4939],
  [11.7500, 79.4100],
  [11.5204, 79.3324],
];

// TSR Section: Ariyalur (ALU) to Tiruchchirappalli (TPJ)
const TSR_SECTION_POLYLINE: [number, number][] = [
  [11.1396, 79.0768],
  [10.9650, 78.8838],
  [10.8624, 78.6997],
  [10.7905, 78.6908],
];

// Helper component for programmatically controlling the Leaflet map instance
interface MapControllerProps {
  centerTarget: [number, number] | null;
  zoomTarget: number | null;
}

const MapController: React.FC<MapControllerProps> = ({ centerTarget, zoomTarget }) => {
  const map = useMap();

  useEffect(() => {
    if (centerTarget) {
      map.flyTo(centerTarget, zoomTarget || 9, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [centerTarget, zoomTarget, map]);

  return null;
};

export const GoogleMapsCorridorMap: React.FC = () => {
  const {
    sections,
    trains,
    selectedSectionId,
    setSelectedSectionId,
    setActiveView,
  } = useRailFlowStore();

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrains, setShowTrains] = useState(true);
  const [showProposedBlocks, setShowProposedBlocks] = useState(true);
  const [showSpeedRestrictions, setShowSpeedRestrictions] = useState(true);
  const [showStations, setShowStations] = useState(true);

  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [centerTarget, setCenterTarget] = useState<[number, number] | null>(null);
  const [zoomTarget, setZoomTarget] = useState<number | null>(null);

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[3];
  const vaigaiTrain = trains.find((t) => t.number === '12635') || trains[0];

  // Google Maps Tile Layer URLs (100% genuine Google Maps styling, zero watermarks)
  const getTileLayerConfig = () => {
    switch (mapType) {
      case 'satellite':
        return {
          url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps',
          maxZoom: 20,
        };
      case 'terrain':
        return {
          url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps',
          maxZoom: 20,
        };
      case 'roadmap':
      default:
        return {
          url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps',
          maxZoom: 20,
        };
    }
  };

  const tileConfig = getTileLayerConfig();

  // Focus directly onto Vaigai Express
  const handleSpotlightVaigai = () => {
    setSelectedTrain(vaigaiTrain);
    setCenterTarget([12.4500, 79.8000]); // Cruising near Madurantakam / Tindivanam
    setZoomTarget(10);
  };

  // Reset view to entire corridor
  const handleResetCorridorView = () => {
    setCenterTarget([11.4500, 79.2000]);
    setZoomTarget(7);
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase();
    if (q.includes('vaigai') || q.includes('12635')) {
      handleSpotlightVaigai();
      return;
    }

    const matchedStation = SR_STATIONS_GEO.find(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase() === q ||
        s.id.toLowerCase() === q
    );

    if (matchedStation) {
      setCenterTarget([matchedStation.lat, matchedStation.lng]);
      setZoomTarget(11);
    }
  };

  // Custom HTML Marker Icons for Trains to prevent overlaps and look extremely premium
  const createTrainIcon = (train: Train) => {
    const isVaigai = train.number === '12635';
    const isPallavan = train.number === '12606';

    const bgColor = isVaigai ? '#123B5D' : isPallavan ? '#DC2626' : '#2C5F7C';
    const borderColor = isVaigai ? '#0FAF9A' : '#FFFFFF';

    const shortName = train.name.split(' ')[0];

    return L.divIcon({
      className: 'custom-train-marker',
      html: `
        <div style="
          display: inline-flex;
          align-items: center;
          width: max-content;
          background: ${bgColor};
          color: #FFFFFF;
          padding: 4px 12px;
          border-radius: 20px;
          border: 2px solid ${borderColor};
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          <span style="font-weight: 800; font-size: 11px; letter-spacing: -0.2px;">${train.number} ${shortName}</span>
          ${
            isVaigai
              ? `<span style="margin-left: 6px; background: #0FAF9A; color: #0C2340; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 10px;">Protected ✓</span>`
              : ''
          }
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  // Custom Station Pin Icon
  const createStationIcon = (station: typeof SR_STATIONS_GEO[0]) => {
    const isHub = station.isMajor;
    return L.divIcon({
      className: 'custom-station-marker',
      html: `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transform: translate(-7px, -7px);
        ">
          <div style="
            width: ${isHub ? '14px' : '11px'};
            height: ${isHub ? '14px' : '11px'};
            background: ${isHub ? '#DC2626' : '#FFFFFF'};
            border: ${isHub ? '2.5px solid #FFFFFF' : '2.5px solid #123B5D'};
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            flex-shrink: 0;
          "></div>
          <span style="
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(4px);
            color: #0F172A;
            font-size: ${isHub ? '10px' : '9px'};
            font-weight: ${isHub ? '800' : '700'};
            padding: 1.5px 4px;
            border-radius: 4px;
            border: 1px solid #CBD5E1;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
            white-space: nowrap;
          ">${station.code}</span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#E5E9EC] rounded-xl overflow-hidden border border-slate-200 shadow-elevated flex flex-col select-none">
      {/* 1. Google Maps Top Search & Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Google Search Bar */}
        <form
          onSubmit={handleSearch}
          className="pointer-events-auto flex items-center bg-white rounded-lg shadow-lg border border-slate-200 px-3 py-2 w-full max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search 12635 Vaigai Express, Villupuram, stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-slate-400 hover:text-slate-700 font-bold px-1"
            >
              Clear
            </button>
          )}
        </form>

        {/* Right: Map Type Switcher (Map / Satellite / Terrain) */}
        <div className="pointer-events-auto flex items-center bg-white rounded-lg shadow-lg border border-slate-200 p-0.5 text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-1 rounded-md transition ${
              mapType === 'roadmap'
                ? 'bg-railway-blue text-white shadow-sm font-bold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1 rounded-md transition ${
              mapType === 'satellite'
                ? 'bg-railway-blue text-white shadow-sm font-bold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapType('terrain')}
            className={`px-3 py-1 rounded-md transition ${
              mapType === 'terrain'
                ? 'bg-railway-blue text-white shadow-sm font-bold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* 2. Google Maps Interactive Filter Chips */}
      <div className="absolute top-16 left-3 z-20 flex items-center space-x-2 overflow-x-auto max-w-[95%] py-1 scrollbar-none pointer-events-auto">
        {/* Spotlight Vaigai Express Button */}
        <button
          type="button"
          onClick={handleSpotlightVaigai}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#123B5D] text-white shadow-lg border-2 border-[#0FAF9A] hover:bg-[#0C2340] hover:scale-105 transition active:scale-95 shrink-0"
        >
          <TrainIcon className="w-4 h-4 text-[#0FAF9A] animate-pulse shrink-0" />
          <span className="text-white font-bold tracking-tight">Spotlight: 12635 Vaigai SF Exp</span>
          <span className="text-[10px] bg-[#0FAF9A] text-[#0C2340] font-black px-2 py-0.5 rounded-full shadow-sm">
            Protected ✓
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowTrains(!showTrains)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border transition shrink-0 ${
            showTrains
              ? 'bg-white text-railway-blue border-railway-blue font-bold shadow-md'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <TrainIcon className="w-3.5 h-3.5 text-railway-blue" />
          <span>All Trains ({trains.length})</span>
          {showTrains && <Check className="w-3.5 h-3.5 text-railway-blue ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => setShowProposedBlocks(!showProposedBlocks)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border transition shrink-0 ${
            showProposedBlocks
              ? 'bg-teal-50 text-teal-900 border-teal-600 font-bold shadow-md'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-teal-600" />
          <span>Coordinated Block (Option B)</span>
          {showProposedBlocks && <Check className="w-3.5 h-3.5 text-teal-600 ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => setShowSpeedRestrictions(!showSpeedRestrictions)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border transition shrink-0 ${
            showSpeedRestrictions
              ? 'bg-amber-50 text-amber-900 border-amber-500 font-bold shadow-md'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>TSR 45k (1)</span>
          {showSpeedRestrictions && <Check className="w-3.5 h-3.5 text-amber-600 ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => setShowStations(!showStations)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border transition shrink-0 ${
            showStations
              ? 'bg-white text-slate-900 border-slate-400 font-bold'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-slate-600" />
          <span>Stations</span>
          {showStations && <Check className="w-3.5 h-3.5 text-slate-900 ml-0.5" />}
        </button>
      </div>

      {/* 3. Real Leaflet Map with Curved Railway Track Geometry */}
      <div className="relative flex-1 w-full h-full z-10">
        <MapContainer
          center={[11.5204, 79.3324]} // Centered on Southern Railway Chord Line corridor
          zoom={8}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController centerTarget={centerTarget} zoomTarget={zoomTarget} />

          {/* Base Tile Layer */}
          <TileLayer
            key={mapType}
            url={tileConfig.url}
            attribution={tileConfig.attribution}
            maxZoom={tileConfig.maxZoom}
          />

          {/* Full Southern Railway Mainline Double Track Polyline */}
          <Polyline
            positions={CORRIDOR_POLYLINE}
            pathOptions={{
              color: '#334155',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          <Polyline
            positions={CORRIDOR_POLYLINE}
            pathOptions={{
              color: '#FFFFFF',
              weight: 2,
              dashArray: '8, 8',
              opacity: 0.9,
            }}
          />

          {/* Focus Section: Villupuram (VM) to Vriddhachalam (VRI) - 3-in-1 Coordinated Block */}
          {showProposedBlocks && (
            <Polyline
              positions={BLOCK_SECTION_POLYLINE}
              pathOptions={{
                color: '#0FAF9A',
                weight: 10,
                opacity: 0.85,
                lineCap: 'round',
              }}
              eventHandlers={{
                click: () => {
                  setSelectedSectionId('S-VM-VRI');
                },
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1">
                  <div className="font-bold text-teal-900"> 3-in-1 Coordinated Block (Option B)</div>
                  <div className="text-slate-600">Villupuram–Vriddhachalam (KM 159–213)</div>
                  <div className="text-emerald-700 font-extrabold mt-0.5">12635 Vaigai Express 100% Protected ✓</div>
                </div>
              </Tooltip>
            </Polyline>
          )}

          {/* TSR Section: Ariyalur (ALU) to Tiruchchirappalli (TPJ) */}
          {showSpeedRestrictions && (
            <Polyline
              positions={TSR_SECTION_POLYLINE}
              pathOptions={{
                color: '#F59E0B',
                weight: 8,
                dashArray: '10, 6',
                opacity: 0.9,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1">
                  <div className="font-bold text-amber-900"> Temporary Speed Restriction (TSR 45 km/h)</div>
                  <div className="text-slate-600">Ariyalur–Tiruchchirappalli (KM 267–336)</div>
                </div>
              </Tooltip>
            </Polyline>
          )}

          {/* Stations along the corridor */}
          {showStations &&
            SR_STATIONS_GEO.map((st) => (
              <Marker
                key={st.id}
                position={[st.lat, st.lng]}
                icon={createStationIcon(st)}
                eventHandlers={{
                  click: () => {
                    setCenterTarget([st.lat, st.lng]);
                    setZoomTarget(11);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 space-y-1 text-xs">
                    <div className="font-extrabold text-sm text-railway-blue">
                      {st.name} ({st.code})
                    </div>
                    <div className="text-slate-600">
                      KM: <span className="font-mono font-bold">{st.km}.0</span> from Chennai Egmore
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Division: {st.km <= 56 ? 'Chennai (MAS)' : st.km <= 336 ? 'Tiruchchirappalli (TPJ)' : 'Madurai (MDU)'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* LIVE TRAINS ALONG THE TRACK (Distributed naturally across 500km corridor with ZERO Overlaps) */}
          {showTrains && (
            <>
              {/* 1. 12635 VAIGAI SF EXP (Northern Section: Cruising near Madurantakam / Melmaruvathur) */}
              <Marker
                position={[12.4500, 79.8000]}
                icon={createTrainIcon(vaigaiTrain)}
                eventHandlers={{
                  click: () => setSelectedTrain(vaigaiTrain),
                }}
              >
                <Popup>
                  <div className="p-2 space-y-1.5 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold bg-railway-blue text-white px-1.5 py-0.5 rounded">
                        12635
                      </span>
                      <span className="font-extrabold text-slate-900">Vaigai SF Express</span>
                    </div>
                    <div className="text-slate-600">
                      Chennai Egmore (13:15) → Madurai Jn (20:35)
                    </div>
                    <div className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Line Clear: Option B completes at 14:00 before Vaigai arrival (15:30)
                    </div>
                    <button
                      onClick={() => setSelectedTrain(vaigaiTrain)}
                      className="w-full mt-1 bg-railway-blue text-white text-[11px] font-bold py-1 rounded shadow-sm hover:bg-railway-dark transition"
                    >
                      Open Train Detail Drawer
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* 2. 12606 Pallavan Superfast Express (Central Section: South of Villupuram near Ulundurpet) */}
              <Marker
                position={[11.7200, 79.4000]}
                icon={createTrainIcon(trains[2])}
                eventHandlers={{
                  click: () => setSelectedTrain(trains[2]),
                }}
              >
                <Popup>
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-extrabold text-rose-700">12606 Pallavan SF Express</div>
                    <div className="text-slate-600">Karaikkudi → Chennai Egmore (On Time)</div>
                  </div>
                </Popup>
              </Marker>

              {/* 3. 16127 Guruvayur Express (Central-South Section: South of Villupuram) */}
              {trains[3] && (
                <Marker
                  position={[11.3800, 79.2400]}
                  icon={createTrainIcon(trains[3])}
                  eventHandlers={{
                    click: () => setSelectedTrain(trains[3]),
                  }}
                >
                  <Popup>
                    <div className="p-2 text-xs space-y-1">
                      <div className="font-bold text-slate-800">16127 Guruvayur Express</div>
                      <div className="text-slate-500">Chennai → Guruvayur (On Time)</div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* 4. 56706 Passenger (Southern Section: Near Lalgudi / Srirangam approach) */}
              <Marker
                position={[10.9400, 78.8400]}
                icon={createTrainIcon(trains[4])}
                eventHandlers={{
                  click: () => setSelectedTrain(trains[4]),
                }}
              >
                <Popup>
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-bold text-slate-800">56706 Villupuram–Madurai Passenger</div>
                    <div className="text-slate-500">Speed: 60 km/h • Controlled Spacing</div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

      {/* 4. Google Maps Style Bottom-Right Map Controls */}
      <div className="absolute bottom-5 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => {
              if (zoomTarget) setZoomTarget(zoomTarget + 1);
              else setZoomTarget(10);
            }}
            className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-100 transition active:bg-slate-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (zoomTarget) setZoomTarget(Math.max(6, zoomTarget - 1));
              else setZoomTarget(7);
            }}
            className="p-2 hover:bg-slate-100 text-slate-700 transition active:bg-slate-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Center / Compass Button */}
        <button
          type="button"
          onClick={handleResetCorridorView}
          className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 flex items-center justify-center text-railway-blue hover:bg-slate-50 transition active:bg-slate-200"
          title="Reset Corridor View"
        >
          <Compass className="w-4 h-4 text-railway-blue" />
        </button>

        {/* Spotlight Navigation Shortcut */}
        <button
          type="button"
          onClick={handleSpotlightVaigai}
          className="bg-railway-blue text-white rounded-lg shadow-xl p-2 flex items-center justify-center hover:bg-railway-dark transition active:scale-95"
          title="Center on 12635 Vaigai SF Express"
        >
          <Navigation className="w-4 h-4 text-railway-teal" />
        </button>
      </div>

      {/* 5. Google Maps Style Bottom-Left Map Scale & Section Peek Card */}
      <div className="absolute bottom-4 left-3 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 p-3.5 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-railway-lightBlue text-railway-blue border border-railway-blue/20">
                {activeSection.id}
              </span>
              <span className="text-xs font-bold text-slate-900">{activeSection.name}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {activeSection.lengthKm} km • Max {activeSection.maxSectionSpeed} km/h • {activeSection.trackType}
            </p>
          </div>
          <span className="text-[10px] font-black text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
            Vaigai Protected ✓
          </span>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Status:</span>{' '}
            <span className="text-teal-700 font-bold">1 Coordinated Block (Option B)</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('planner')}
            className="text-[11px] font-bold text-railway-blue hover:text-railway-dark underline flex items-center space-x-1"
          >
            <span>Open Planner</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Train Detail Drawer */}
      <TrainDetailDrawer
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
      />
    </div>
  );
};
