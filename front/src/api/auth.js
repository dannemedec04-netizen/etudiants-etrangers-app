import { post } from "./client";

export function register(data) {
  return post("/auth/register", data);
}

export function login(data) {
  return post("/auth/login", data);
}
