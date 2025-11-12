import axios from "axios";

// Create axios instance với base URL
const api = axios.create({
  baseURL: "https://zip.klong.io.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - xóa token và redirect đến login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            // window.location.href = '/login';
          }
          break;

        case 400:
          // Bad request - validation errors
          if (Array.isArray(data.message)) {
            console.error("Validation errors:", data.message);
          } else {
            console.error("Error:", data.message);
          }
          break;

        case 404:
          console.error("Not found:", data.message || "Không tìm thấy dữ liệu");
          break;

        case 500:
          console.error("Server error:", "Lỗi server, vui lòng thử lại sau");
          break;

        default:
          console.error("Error:", "Có lỗi xảy ra");
      }
    } else if (error.request) {
      console.error("Network error:", "Không thể kết nối đến server");
    }

    return Promise.reject(error);
  }
);

export default api;
