import { get, patch, post } from "./client";

export function getChecklist() {
  return get(`/admin/checklist`);
}

export function createChecklistItem(data) {
  return post(`/admin/checklist`, data);
}

export function setChecklistItemDone(itemId, done) {
  return patch(`/admin/checklist/item/${itemId}`, { done });
}

export function getAids(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return get(`/admin/aids${query}`);
}
