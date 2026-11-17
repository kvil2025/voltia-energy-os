import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CHILEAN_NODES, TRANSMISSION_LINES } from '../data/chileanGridData';
import { ChileanNode } from '../types/energy';
import { Layers, Mountain, Eye, Map as MapIcon, Globe, Compass, ArrowRight, Zap, AlertTriangle } from 'lucide-react';

interface InteractiveGisMapProps {
  selectedNodeId: string;
  onSelectNode: (node: ChileanNode) => void;
  zoneFilter?: string;
}

type BaseLayerType = 'opentopo' | 'dark' | 'satellite' | 'osm';

export const InteractiveGisMap: React.FC<InteractiveGisMapProps> = ({
  selectedNodeId,
  onSelectNode,
  zoneFilter = 'ALL',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const linesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState<BaseLayerType>('opentopo');
  const [activeZoom, setActiveZoom] = useState<number>(5);

  // Basemap URLs and Attributions
  const BASE_LAYERS: Record<BaseLayerType, { name: string; url: string; attribution: string; maxZoom: number }> = {
    opentopo: {
      name: 'OpenTopoMap (Curvas de Nivel)',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (&copy; OSM / SRTM)',
      maxZoom: 17,
    },
    dark: {
      name: 'CartoDB Dark Matter',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/" target="_blank">CARTO</a>',
      maxZoom: 19,
    },
    satellite: {
      name: 'Esri World Imagery (Satélite)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 18,
    },
    osm: {
      name: 'OpenStreetMap Estándar',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a>',
      maxZoom: 19,
    },
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on central/north Chile: lat -29.5, lon -70.5, zoom 5
    const map = L.map(mapContainerRef.current, {
      center: [-29.8, -70.8],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
    });

    // Add custom zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer (OpenTopoMap default for terrain contours)
    const initialTile = L.tileLayer(BASE_LAYERS.opentopo.url, {
      attribution: BASE_LAYERS.opentopo.attribution,
      maxZoom: BASE_LAYERS.opentopo.maxZoom,
    }).addTo(map);

    currentTileLayerRef.current = initialTile;
    linesLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    map.on('zoomend', () => {
      setActiveZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Basemap Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = BASE_LAYERS[activeBaseLayer];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);

    // Ensure tile layer stays beneath transmission lines & markers
    newLayer.bringToBack();
    currentTileLayerRef.current = newLayer;
  }, [activeBaseLayer]);

  // 3. Render Transmission Lines and Substation Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !linesLayerGroupRef.current) return;
    const linesGroup = linesLayerGroupRef.current;
    linesGroup.clearLayers();
    markersRef.current = {};

    // A. Draw Transmission Lines
    TRANSMISSION_LINES.forEach((line) => {
      const fromNode = CHILEAN_NODES.find((n) => n.id === line.from);
      const toNode = CHILEAN_NODES.find((n) => n.id === line.to);
      if (!fromNode || !toNode) return;

      const isCongested = line.status === 'CRITICAL_CONGESTION' || line.status === 'SATURATED';
      const is500kV = line.voltage === 500;

      const lineColor = isCongested
        ? '#f59e0b' // High-voltage Amber for Cardones-Polpaico bottleneck
        : is500kV
        ? '#00e5ff' // Electric Cyan for 500 kV trunk
        : '#94a3b8'; // Slate for 220 kV trunk

      const polyline = L.polyline(
        [
          [fromNode.lat, fromNode.lon],
          [toNode.lat, toNode.lon],
        ],
        {
          color: lineColor,
          weight: is500kV ? 3.5 : 2.2,
          opacity: isCongested ? 0.95 : 0.8,
          dashArray: isCongested ? '8, 8' : undefined,
        }
      );

      polyline.bindTooltip(
        `<div class="font-mono text-xs text-white">
          <div class="font-semibold">${fromNode.name} ➔ ${toNode.name}</div>
          <div class="text-[10px] text-gray-300">${line.voltage} kV | Capacidad: ${line.ratingMva} MVA</div>
          <div class="text-[10px] ${isCongested ? 'text-amber-400 font-bold' : 'text-emerald-400'}">
            ESTADO: ${line.status.replace('_', ' ')}
          </div>
        </div>`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );

      linesGroup.addLayer(polyline);
    });

    // B. Draw Substation Markers
    CHILEAN_NODES.forEach((node) => {
      const isSelected = node.id === selectedNodeId;
      const isFiltered = zoneFilter !== 'ALL' && node.zone !== zoneFilter;

      // Color by BESS Arbitrage Score
      const markerColor =
        node.arbitrageScore >= 90
          ? '#10b981' // Top Tier BESS (Emerald)
          : node.arbitrageScore >= 75
          ? '#00e5ff' // High Tier BESS (Cyan)
          : '#f59e0b'; // Standard Tier (Amber)

      const pulseHtml = `
        <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: ${isSelected ? '28px' : '20px'};
            height: ${isSelected ? '28px' : '20px'};
            border-radius: 50%;
            background-color: ${markerColor};
            opacity: ${isFiltered ? '0.35' : '0.9'};
            box-shadow: 0 0 ${isSelected ? '16px' : '8px'} ${markerColor};
            border: 2px solid #ffffff;
            transition: all 0.25s ease;
          "></div>
          ${
            isSelected
              ? `<div style="
                  position: absolute;
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  border: 2px dashed ${markerColor};
                  animation: spin 6s linear infinite;
                "></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: pulseHtml,
        className: 'custom-substation-pin',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([node.lat, node.lon], { icon: customIcon });

      // Rich Apple HIG Dark Popup
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 8px;">
            <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${node.name}</div>
            <span style="font-size: 9px; font-family: monospace; padding: 2px 5px; border-radius: 4px; background: rgba(0,229,255,0.15); color: #00e5ff; border: 1px solid rgba(0,229,255,0.3);">
              ${node.voltageKv} kV
            </span>
          </div>

          <div style="font-size: 11px; color: #9ca3af; margin-bottom: 8px;">
            <div><strong>Región:</strong> ${node.region}</div>
            <div><strong>Zona SEN:</strong> ${node.zone}</div>
          </div>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px 8px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
              <span style="color: #9ca3af;">Costo Marg. Medio:</span>
              <span style="color: #ffffff; font-weight: 600;">$${node.avgMarginalPrice.toFixed(1)} /MWh</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
              <span style="color: #9ca3af;">Horas Precio Cero:</span>
              <span style="color: #eab308; font-weight: 600;">${node.zeroPriceHoursYear} hrs/año</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <span style="color: #9ca3af;">Score BESS Arbitraje:</span>
              <span style="color: ${markerColor}; font-weight: 700;">${node.arbitrageScore} / 100</span>
            </div>
          </div>

          <button id="btn-select-node-${node.id}" style="
            width: 100%;
            background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 100%);
            color: #060709;
            font-size: 11px;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: opacity 0.2s;
          ">
            <span>Simular BESS en esta Barra</span>
            <span>➔</span>
          </button>
        </div>
      `;

      // Attach button click event inside popup
      const selectBtn = popupContent.querySelector(`#btn-select-node-${node.id}`);
      if (selectBtn) {
        selectBtn.addEventListener('click', () => {
          onSelectNode(node);
          marker.closePopup();
        });
      }

      marker.bindPopup(popupContent, { maxWidth: 260 });
      marker.on('click', () => {
        onSelectNode(node);
      });

      markersRef.current[node.id] = marker;
      linesGroup.addLayer(marker);
    });
  }, [selectedNodeId, zoneFilter, onSelectNode]);

  // 4. Focus Map on Selected Node
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedNodeId) return;
    const node = CHILEAN_NODES.find((n) => n.id === selectedNodeId);
    if (!node) return;

    mapInstanceRef.current.flyTo([node.lat, node.lon], 8, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    const marker = markersRef.current[selectedNodeId];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 800);
    }
  }, [selectedNodeId]);

  // Helper: Jump Map to Regions
  const jumpToRegion = (region: 'SEN' | 'NORTE_GRANDE' | 'NORTE_CHICO' | 'CENTRO' | 'SUR') => {
    if (!mapInstanceRef.current) return;
    const coords: Record<string, { center: [number, number]; zoom: number }> = {
      SEN: { center: [-30.5, -71.0], zoom: 5 },
      NORTE_GRANDE: { center: [-22.5, -69.5], zoom: 7 },
      NORTE_CHICO: { center: [-28.5, -70.8], zoom: 7 },
      CENTRO: { center: [-33.5, -71.0], zoom: 7 },
      SUR: { center: [-39.0, -72.5], zoom: 6 },
    };
    const target = coords[region];
    mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.0 });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#080a0f] rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
      {/* Top Map Toolbar */}
      <div className="p-3 bg-[#0d1118]/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-2 z-[1000] relative">
        {/* Layer Selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveBaseLayer('opentopo')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeBaseLayer === 'opentopo'
                ? 'bg-[#00e5ff] text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="OpenTopoMap: Relieve topográfico con curvas de nivel y sombreado de elevación"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>OpenTopo</span>
          </button>

          <button
            onClick={() => setActiveBaseLayer('dark')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeBaseLayer === 'dark'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="CartoDB Dark Matter: Modo nocturno de alta precisión"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => setActiveBaseLayer('satellite')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeBaseLayer === 'satellite'
                ? 'bg-emerald-400 text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Esri World Imagery: Ortofoto satelital de alta resolución"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satélite</span>
          </button>

          <button
            onClick={() => setActiveBaseLayer('osm')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeBaseLayer === 'osm'
                ? 'bg-blue-400 text-black font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="OpenStreetMap: Mapa vectorial clásico"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>OSM</span>
          </button>
        </div>

        {/* Quick Regional Jumps */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-gray-500 mr-1 hidden sm:inline">Enfoque:</span>
          <button
            onClick={() => jumpToRegion('SEN')}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            SEN Total
          </button>
          <button
            onClick={() => jumpToRegion('NORTE_GRANDE')}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            N.Grande
          </button>
          <button
            onClick={() => jumpToRegion('NORTE_CHICO')}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            N.Chico
          </button>
          <button
            onClick={() => jumpToRegion('CENTRO')}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            Centro
          </button>
          <button
            onClick={() => jumpToRegion('SUR')}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            Sur
          </button>
        </div>
      </div>

      {/* Real Leaflet Map Viewport */}
      <div className="relative w-full flex-1 min-h-[440px] sm:min-h-[520px]">
        <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

        {/* Floating Topographic Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-[#0c1017]/90 backdrop-blur-md p-2.5 rounded-xl border border-white/15 text-[10px] font-mono text-gray-300 shadow-xl max-w-[210px] pointer-events-none sm:pointer-events-auto">
          <div className="text-white font-semibold flex items-center gap-1.5 pb-1 border-b border-white/10 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>LEYENDA RED SEN GIS</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-[#00e5ff] rounded-full inline-block" />
              <span>Troncal 500 kV</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#94a3b8] rounded-full inline-block" />
              <span>Troncal 220 kV</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 border-b-2 border-dashed border-[#f59e0b] inline-block" />
              <span className="text-amber-400 font-bold">Cuello Cardones-Polpaico</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
              <span>Score BESS &gt; 90 (Óptimo)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] inline-block" />
              <span>Score BESS 75 - 89</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
              <span>Score BESS &lt; 75</span>
            </div>
          </div>
        </div>

        {/* Telemetry pill */}
        <div className="absolute top-3 left-3 z-[1000] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-mono text-[#00e5ff] flex items-center gap-1.5">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>CAPA ACTIVA: {BASE_LAYERS[activeBaseLayer].name.toUpperCase()} (ZOOM: {activeZoom}x)</span>
        </div>
      </div>
    </div>
  );
};
