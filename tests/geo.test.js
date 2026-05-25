import { describe, it, expect } from 'vitest';
import { haversineKm, isInNormandy, sortByDistance } from '../src/lib/geo.js';

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(49.44, 1.09, 49.44, 1.09)).toBe(0);
  });

  it('calculates Rouen → Caen correctly (~120 km)', () => {
    const dist = haversineKm(49.4395, 1.0938, 49.183, -0.3573);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(140);
  });

  it('calculates Rouen → Le Havre correctly (~85 km)', () => {
    const dist = haversineKm(49.4395, 1.0938, 49.4919, 0.1063);
    expect(dist).toBeGreaterThan(70);
    expect(dist).toBeLessThan(100);
  });

  it('is symmetric', () => {
    const d1 = haversineKm(49.44, 1.09, 49.18, -0.36);
    const d2 = haversineKm(49.18, -0.36, 49.44, 1.09);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });

  it('handles antimeridian crossing (lng ≈ ±180)', () => {
    const dist = haversineKm(0, -179, 0, 179);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(500);
  });

  it('handles poles', () => {
    const dist = haversineKm(90, 0, -90, 0);
    expect(dist).toBeCloseTo(20015, -2);
  });
});

describe('isInNormandy', () => {
  it('returns true for Rouen', () => {
    expect(isInNormandy(49.4395, 1.0938)).toBe(true);
  });

  it('returns true for Caen', () => {
    expect(isInNormandy(49.183, -0.3573)).toBe(true);
  });

  it('returns false for Paris', () => {
    expect(isInNormandy(48.8566, 2.3522)).toBe(false);
  });

  it('returns false for London', () => {
    expect(isInNormandy(51.5074, -0.1278)).toBe(false);
  });

  it('returns false for Marseille', () => {
    expect(isInNormandy(43.2965, 5.3698)).toBe(false);
  });
});

describe('sortByDistance', () => {
  const pubs = [
    { pub_id: 'far', lat: 49.183, lng: -0.3573 },  // Caen
    { pub_id: 'near', lat: 49.4395, lng: 1.0938 }, // Rouen
  ];

  it('sorts nearest pub first', () => {
    // User is in Rouen
    const sorted = sortByDistance(pubs, 49.44, 1.09);
    expect(sorted[0].pub_id).toBe('near');
    expect(sorted[1].pub_id).toBe('far');
  });

  it('does not mutate the original array', () => {
    const original = [...pubs];
    sortByDistance(pubs, 48.0, 2.0);
    expect(pubs).toEqual(original);
  });
});
