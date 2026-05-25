const NORMANDY_BOUNDS = {
  latMin: 48.5, latMax: 50.1,
  lngMin: -1.9, lngMax: 1.8,
};

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function isInNormandy(lat, lng) {
  return (
    lat >= NORMANDY_BOUNDS.latMin &&
    lat <= NORMANDY_BOUNDS.latMax &&
    lng >= NORMANDY_BOUNDS.lngMin &&
    lng <= NORMANDY_BOUNDS.lngMax
  );
}

const TIMEOUT_MS = 10_000;

export function getCurrentPosition() {
  return Promise.race([
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
      );
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS),
    ),
  ]);
}

export function sortByDistance(pubs, lat, lng) {
  return [...pubs].sort(
    (a, b) => haversineKm(lat, lng, a.lat, a.lng) - haversineKm(lat, lng, b.lat, b.lng),
  );
}
