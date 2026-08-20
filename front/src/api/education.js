import { get } from "./client";

function toQuery(params) {
  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `?${query}` : "";
}

export function getFormations({ field, city, type } = {}) {
  return get(`/education/formations${toQuery({ field, city, type })}`);
}

export function getJobOffers({ field, type } = {}) {
  return get(`/education/offers${toQuery({ field, type })}`);
}
