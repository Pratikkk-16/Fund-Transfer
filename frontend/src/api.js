const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || "Request failed";
    throw new Error(message);
  }
  return response.json();
}

export async function fetchBalance(userId) {
  const res = await fetch(`${API_BASE_URL}/balance/${userId}`);
  return handleResponse(res);
}

export async function fetchHistory(userId) {
  const res = await fetch(`${API_BASE_URL}/history/${userId}`);
  return handleResponse(res);
}

export async function submitTransfer(payload) {
  const res = await fetch(`${API_BASE_URL}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

