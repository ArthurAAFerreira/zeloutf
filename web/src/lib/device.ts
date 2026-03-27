const DEVICE_KEY = 'zelo_device_id';

export function getDeviceId(): string {
  const current = localStorage.getItem(DEVICE_KEY);
  if (current) return current;

  const created = Math.random().toString(36).substring(2, 10);
  localStorage.setItem(DEVICE_KEY, created);
  return created;
}
