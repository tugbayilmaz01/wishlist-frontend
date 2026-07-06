const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5062/api";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string, body: any) =>
    request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: any) =>
    request(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: "DELETE" }),
};

async function request(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("token");
    if (!window.location.pathname.startsWith("/shared/")) {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage =
          errorData.message || errorData.title || JSON.stringify(errorData);
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  return response.json();
}
