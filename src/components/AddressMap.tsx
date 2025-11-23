import React, { useEffect, useRef } from "react";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { checkoutData } from "../store/checkoutStore";

interface AddressMapProps {
  apiKey?: string;
  debounceMs?: number;
}

// Helper to load Google Maps script
function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded
    if (typeof window !== "undefined" && (window as any).google?.maps) {
      resolve();
      return;
    }

    // Prevent double injection
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.setAttribute("loading", "async");
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

const AddressMap: React.FC<AddressMapProps> = ({
  apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  debounceMs = 1200,
}) => {
  useSignals();

  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const status = useSignal<string>("");
  const address = useSignal<string>("");
  const suggestions = useSignal<any[]>([]);
  const isFetching = useSignal<boolean>(false);
  const noSuggestionsHint = useSignal<boolean>(false);

  // Service references
  const mapObjRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const suggestReqTimestampsRef = useRef<number[]>([]);
  const searchReqTimestampsRef = useRef<number[]>([]);

  const nowMs = () => Date.now();
  const pruneWindow = (arr: number[], windowMs: number) => {
    const cutoff = nowMs() - windowMs;
    while (arr.length > 0 && arr[0] < cutoff) arr.shift();
  };
  const recordReq = (arr: number[]) => {
    arr.push(nowMs());
  };
  const shouldThrottle = (arr: number[], limit: number, windowMs: number) => {
    pruneWindow(arr, windowMs);
    return arr.length >= limit;
  };

  const buildCoordsUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  useEffect(() => {
    if (!apiKey) {
      status.value = "Falta Google Maps API key";
      return;
    }

    let map: any = null;
    let marker: any = null;

    loadGoogleMaps(apiKey)
      .then(async () => {
        if (!mapRef.current) return;
        const g: any = (window as any).google;

        const initialCenter = { lat: -12.066722, lng: -77.041824 }; // Lima, Peru

        map = new g.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 17,
          streetViewControl: false,
          mapTypeControl: false,
          mapId: "mp-gravity-checkout-map", // Required for AdvancedMarkerElement
        });

        // Save references
        mapObjRef.current = map;
        geocoderRef.current = new g.maps.Geocoder();
        autocompleteServiceRef.current =
          new g.maps.places.AutocompleteService();
        sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();

        // Create AdvancedMarkerElement (new API)
        const { AdvancedMarkerElement } = await g.maps.importLibrary("marker");
        marker = new AdvancedMarkerElement({
          map,
          position: initialCenter,
          gmpDraggable: true,
        });
        markerRef.current = marker;

        // Hydrate from checkoutData if available
        const data = checkoutData.value;
        if (
          data?.coords &&
          typeof data.coords.lat === "number" &&
          typeof data.coords.lng === "number"
        ) {
          address.value = data.address || "";
          const loc = { lat: data.coords.lat, lng: data.coords.lng };
          marker.position = loc; // Use position property instead of setPosition
          map.panTo(loc);
          map.setZoom(16);
        }

        // Click on map to set marker
        map.addListener("click", (e: any) => {
          if (!e.latLng || !marker) return;
          marker.position = e.latLng; // Use position property
          map.panTo(e.latLng);
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          checkoutData.value = {
            ...checkoutData.value,
            coords: { lat, lng },
            coords_url: buildCoordsUrl(lat, lng),
          };
        });

        // Update coords when marker drag ends
        marker.addListener("dragend", (event: any) => {
          const pos = marker.position; // Use position property directly
          if (!pos) return;
          const lat = typeof pos.lat === "function" ? pos.lat() : pos.lat;
          const lng = typeof pos.lng === "function" ? pos.lng() : pos.lng;
          checkoutData.value = {
            ...checkoutData.value,
            coords: { lat, lng },
            coords_url: buildCoordsUrl(lat, lng),
          };
        });

        status.value = "";
      })
      .catch((e) => {
        console.error("Error loading Google Maps:", e);
        status.value = "No se pudo cargar Google Maps";
      });

    return () => {
      marker = null;
      map = null;
    };
  }, [apiKey]);

  // Schedule suggestions with debounce
  const scheduleSuggestions = () => {
    if (!autocompleteServiceRef.current || !mapObjRef.current) return;
    const q = address.value.trim();
    suggestions.value = [];
    noSuggestionsHint.value = false;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (q.length < 4) return; // Minimum 4 characters

    debounceTimerRef.current = setTimeout(() => {
      // Throttle suggestions
      if (shouldThrottle(suggestReqTimestampsRef.current, 4, 10_000)) {
        isFetching.value = false;
        status.value = "Demasiadas búsquedas seguidas, espera unos segundos";
        return;
      }
      recordReq(suggestReqTimestampsRef.current);
      isFetching.value = true;
      const g: any = (window as any).google;
      const bounds = mapObjRef.current?.getBounds?.();
      const request: any = {
        input: q,
        sessionToken: sessionTokenRef.current,
        componentRestrictions: { country: ["pe"] },
        // Don't specify types to allow both addresses and establishments
      };
      const mapBounds = mapObjRef.current?.getBounds?.();
      if (mapBounds) {
        request.locationBias = mapBounds; // Use locationBias instead of deprecated bounds
      }
      try {
        autocompleteServiceRef.current.getPlacePredictions(
          request,
          (preds: any[], status: any) => {
            isFetching.value = false;
            const ok = status === g.maps.places.PlacesServiceStatus.OK;
            const list = ok && Array.isArray(preds) ? preds : [];
            suggestions.value = list;
            if (!ok || list.length === 0) {
              noSuggestionsHint.value = true;
            }
          },
        );
      } catch (e) {
        isFetching.value = false;
        suggestions.value = [];
        noSuggestionsHint.value = true;
      }
    }, debounceMs) as unknown as number;
  };

  // Direct search on Enter
  const handleDirectSearch = () => {
    const q = address.value.trim();
    if (!q) return;
    const g: any = (window as any).google;
    if (
      !mapObjRef.current ||
      !markerRef.current ||
      !geocoderRef.current ||
      !placesServiceRef.current
    )
      return;

    // Throttle direct search
    if (shouldThrottle(searchReqTimestampsRef.current, 3, 10_000)) {
      status.value = "Demasiadas búsquedas seguidas, espera unos segundos";
      noSuggestionsHint.value = true;
      return;
    }
    recordReq(searchReqTimestampsRef.current);

    // Reset token
    try {
      sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
    } catch {}

    suggestions.value = [];
    noSuggestionsHint.value = false;

    // Geocoding first
    try {
      geocoderRef.current.geocode(
        {
          address: q,
          bounds: mapObjRef.current.getBounds?.(),
          componentRestrictions: { country: "PE" },
        },
        (results: any[], status: any) => {
          const ok = status === g.maps.GeocoderStatus.OK;
          if (ok && results && results.length > 0) {
            const r = results[0];
            const loc = r.geometry?.location;
            if (!loc) return;

            // Filter by Peru
            const comps: any[] = r.address_components || [];
            const countryComp = comps.find((c: any) =>
              (c.types || []).includes("country"),
            );
            if (
              !countryComp ||
              (countryComp.short_name !== "PE" &&
                countryComp.long_name !== "Peru")
            ) {
              status.value = "Solo buscamos direcciones en Perú";
              noSuggestionsHint.value = true;
              return;
            }

            const lat = loc.lat();
            const lng = loc.lng();
            address.value = r.formatted_address ?? q;
            markerRef.current.position = loc; // Use position property
            mapObjRef.current.panTo(loc);
            mapObjRef.current.setZoom(16);
            checkoutData.value = {
              ...checkoutData.value,
              address: address.value,
              coords: { lat, lng },
              place_id: (r as any)?.place_id ?? null,
              coords_url: buildCoordsUrl(lat, lng),
            };
            return;
          }

          // Fallback to Places
          try {
            const sw = new g.maps.LatLng(-18.35, -81.33);
            const ne = new g.maps.LatLng(-0.04, -68.65);
            const peruBounds = new g.maps.LatLngBounds(sw, ne);
            placesServiceRef.current.findPlaceFromQuery(
              {
                query: `${q}, Peru`,
                fields: [
                  "place_id",
                  "geometry",
                  "name",
                  "formatted_address",
                  "address_components",
                ],
                locationBias: peruBounds,
              },
              (results2: any[], status2: any) => {
                const ok2 = status2 === g.maps.places.PlacesServiceStatus.OK;
                if (!ok2 || !results2 || results2.length === 0) {
                  noSuggestionsHint.value = true;
                  return;
                }
                const p = results2[0];
                const loc2 = p.geometry?.location;
                if (!loc2) return;

                // Filter by Peru
                const comps2: any[] = p.address_components || [];
                const countryComp2 = comps2.find((c: any) =>
                  (c.types || []).includes("country"),
                );
                if (
                  !countryComp2 ||
                  (countryComp2.short_name !== "PE" &&
                    countryComp2.long_name !== "Peru")
                ) {
                  status.value = "Solo buscamos direcciones en Perú";
                  noSuggestionsHint.value = true;
                  return;
                }

                const lat2 = loc2.lat();
                const lng2 = loc2.lng();
                address.value = p.formatted_address ?? p.name ?? q;
                markerRef.current.position = loc2; // Use position property
                mapObjRef.current.panTo(loc2);
                mapObjRef.current.setZoom(16);
                checkoutData.value = {
                  ...checkoutData.value,
                  address: address.value,
                  coords: { lat: lat2, lng: lng2 },
                  place_id: p.place_id ?? null,
                  coords_url: buildCoordsUrl(lat2, lng2),
                };
              },
            );
          } catch {}
        },
      );
    } catch {}
  };

  // Select suggestion
  const handleSelectSuggestion = (pred: any) => {
    const g: any = (window as any).google;
    const desc = pred?.description ?? "";
    if (!desc || !mapObjRef.current || !markerRef.current) return;

    // Reset token
    try {
      sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
    } catch {}

    suggestions.value = [];

    // Geocoding first
    try {
      geocoderRef.current.geocode(
        {
          address: desc,
          bounds: mapObjRef.current.getBounds?.(),
          componentRestrictions: { country: "PE" },
        },
        (results: any[], status: any) => {
          const ok = status === g.maps.GeocoderStatus.OK;
          if (ok && results && results.length > 0) {
            const r = results[0];
            const loc = r.geometry?.location;
            if (!loc) return;

            // Filter by Peru
            const comps: any[] = r.address_components || [];
            const countryComp = comps.find((c: any) =>
              (c.types || []).includes("country"),
            );
            if (
              !countryComp ||
              (countryComp.short_name !== "PE" &&
                countryComp.long_name !== "Peru")
            ) {
              status.value = "Solo sugerimos direcciones en Perú";
              return;
            }

            const lat = loc.lat();
            const lng = loc.lng();
            address.value = r.formatted_address ?? desc;
            markerRef.current.position = loc; // Use position property
            mapObjRef.current.panTo(loc);
            mapObjRef.current.setZoom(16);
            checkoutData.value = {
              ...checkoutData.value,
              address: address.value,
              coords: { lat, lng },
              place_id: pred.place_id ?? (r as any)?.place_id ?? null,
              coords_url: buildCoordsUrl(lat, lng),
            };
            return;
          }

          // Fallback to Places for businesses
          try {
            const sw = new g.maps.LatLng(-18.35, -81.33);
            const ne = new g.maps.LatLng(-0.04, -68.65);
            const peruBounds = new g.maps.LatLngBounds(sw, ne);
            placesServiceRef.current.findPlaceFromQuery(
              {
                query: `${desc}, Peru`,
                fields: [
                  "place_id",
                  "geometry",
                  "name",
                  "formatted_address",
                  "address_components",
                ],
                locationBias: peruBounds,
              },
              (results2: any[], status2: any) => {
                const ok2 = status2 === g.maps.places.PlacesServiceStatus.OK;
                if (!ok2 || !results2 || results2.length === 0) return;
                const p = results2[0];
                const loc2 = p.geometry?.location;
                if (!loc2) return;

                // Filter by Peru
                const comps2: any[] = p.address_components || [];
                const countryComp2 = comps2.find((c: any) =>
                  (c.types || []).includes("country"),
                );
                if (
                  !countryComp2 ||
                  (countryComp2.short_name !== "PE" &&
                    countryComp2.long_name !== "Peru")
                ) {
                  status.value = "Solo sugerimos direcciones en Perú";
                  return;
                }

                const lat2 = loc2.lat();
                const lng2 = loc2.lng();
                address.value = p.formatted_address ?? p.name ?? desc;
                markerRef.current.position = loc2; // Use position property
                mapObjRef.current.panTo(loc2);
                mapObjRef.current.setZoom(16);
                checkoutData.value = {
                  ...checkoutData.value,
                  address: address.value,
                  coords: { lat: lat2, lng: lng2 },
                  place_id: p.place_id ?? null,
                  coords_url: buildCoordsUrl(lat2, lng2),
                };
              },
            );
          } catch {}
        },
      );
    } catch {}
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">
        Dirección de entrega
      </label>
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
        placeholder="Ingresa tu dirección (mínimo 4 caracteres)"
        value={address.value}
        onInput={(e) => {
          const target = e.currentTarget as HTMLInputElement;
          address.value = target.value;
          scheduleSuggestions();
        }}
      />

      {/* Loading indicator */}
      {isFetching.value && (
        <p className="text-xs text-gray-500">Buscando direcciones...</p>
      )}

      {/* Suggestions dropdown */}
      {suggestions.value.length > 0 && (
        <ul className="divide-y rounded-lg border bg-white shadow-sm">
          {suggestions.value.map((pred: any, idx: number) => (
            <li
              key={idx}
              className="cursor-pointer px-3 py-2 hover:bg-gray-50"
              onClick={() => handleSelectSuggestion(pred)}
            >
              <p className="text-sm text-gray-800">
                {pred?.structured_formatting?.main_text ?? pred?.description}
              </p>
              {pred?.structured_formatting?.secondary_text && (
                <p className="text-xs text-gray-500">
                  {pred.structured_formatting.secondary_text}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Map */}
      <div
        ref={mapRef}
        className="h-80 w-full rounded-lg border border-gray-200"
      />

      {/* Status/Error messages */}
      {status.value && <p className="text-sm text-red-600">{status.value}</p>}

      {/* Coordinates display */}
      {checkoutData.value.coords && (
        <p className="text-xs text-gray-600">
          Coordenadas: {checkoutData.value.coords.lat.toFixed(6)},{" "}
          {checkoutData.value.coords.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default AddressMap;
