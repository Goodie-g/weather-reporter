export const units = {
  temperature: { C: 'C', F: 'F' },
  speed: { kph: 'kph', mph: 'mph' },
  distance: { km: 'km', miles: 'miles' },
  pressure: { mb: 'mb', in: 'in' },
  precipitation: { mm: 'mm', in: 'in' }
};

export function isImperial(unit) {
  return unit === units.temperature.F;
}
