import axios, { AxiosError } from "axios";

type UnauthorizedDetail = {
  status?: number;
  message?: string;
  url?: string;
};

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    if (typeof window !== "undefined" && status === 401) {
      const detail: UnauthorizedDetail = {
        status,
        message: error.response?.data?.message,
        url: error.config?.url,
      };
      console.log("[api] 401 unauthorized", detail);
      window.dispatchEvent(new CustomEvent<UnauthorizedDetail>("auth:unauthorized", { detail }));
    }
    return Promise.reject(error);
  }
);

// ── Named API helpers ──────────────────────────────────────────────────────

export const authAPI = {
  me:             ()         => API.get("/auth/me"),
  login:          (data: any)=> API.post("/auth/login", data),
  changePassword: (data: any)=> API.post("/auth/change-password", data),
}

export const appointmentAPI = {
  getAll:   ()              => API.get("/appointments"),
  getById:  (id: string)    => API.get(`/appointments/${id}`),
  create:   (data: any)     => API.post("/appointments", data),
  update:   (id: string, data: any) => API.put(`/appointments/${id}`, data),
  updateStatus: (id: string, status: string) => API.put(`/appointments/${id}/status`, { status }),
  delete:   (id: string)    => API.delete(`/appointments/${id}`),
}

export const prescriptionAPI = {
  getAll:   ()              => API.get("/prescriptions"),
  getById:  (id: string)    => API.get(`/prescriptions/${id}`),
  create:   (data: any)     => API.post("/prescriptions", data),
  update:   (id: string, data: any) => API.put(`/prescriptions/${id}`, data),
  delete:   (id: string)    => API.delete(`/prescriptions/${id}`),
}

export const patientAPI = {
  getAll:   ()              => API.get("/patients"),
  getById:  (id: string)    => API.get(`/patients/${id}`),
  create:   (data: any)     => API.post("/patients", data),
  update:   (id: string, data: any) => API.put(`/patients/${id}`, data),
}

export const analyticsAPI = {
  getAdmin: ()              => API.get("/analytics/admin"),
  getDoctor:()              => API.get("/analytics/doctor"),
}

export default API;