import { post } from "./client";

export function sendMessage(messages) {
  return post("/chatbot/message", { messages });
}
