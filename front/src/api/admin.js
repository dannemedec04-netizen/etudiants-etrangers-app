import { get, patch, post } from "./client";

export function getChecklist(userId) {
  return get(`/admin/checklist/${userId}`);
}

export function createChecklistItem(userId, data) {
  return post(`/admin/checklist/${userId}`, data);
}

export function setChecklistItemDone(itemId, done) {
  return patch(`/admin/checklist/item/${itemId}`, { done });
}

export function getAids(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return get(`/admin/aids${query}`);
}
