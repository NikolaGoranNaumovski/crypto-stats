import { ApiClient } from "@nnaumovski/react-api-client";

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL_V1 || "http://localhost:3000"
);
