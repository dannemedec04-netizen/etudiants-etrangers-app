const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function get(path) {
  return request(path);
}

export function post(path, data) {
  return request(path, { method: "POST", body: JSON.stringify(data) });
}

export function patch(path, data) {
  return request(path, { method: "PATCH", body: JSON.stringify(data) });
}
