/** Location payload shared by create/edit event forms and Google Places picker. */
export interface EventLocation {
  venueName?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  googleMapsUrl?: string | null;
}

export function buildGoogleMapsUrl(options: {
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  address?: string | null;
}): string | null {
  const { latitude, longitude, placeId, address } = options;

  if (placeId) {
    const query = address?.trim() || (latitude != null && longitude != null
      ? `${latitude},${longitude}`
      : 'place');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=${encodeURIComponent(placeId)}`;
  }

  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  if (address?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
  }

  return null;
}
