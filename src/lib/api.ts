import axios from "axios";
import { supabase } from "@/lib/supabase";

// Create axios instance với base URL
const api = axios.create({
  baseURL: "https://zip.klong.io.vn/api",
  // baseURL: "http://localhost:3011/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache token để tránh gọi getSession() liên tục
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;
let isInitialized = false;

// Hàm khởi tạo token (chỉ gọi 1 lần)
const initializeToken = async () => {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      cachedToken = session.access_token;
      tokenExpiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    }
  } catch (error) {
    console.error("Error initializing token:", error);
  }

  // Lắng nghe auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      cachedToken = session.access_token;
      tokenExpiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    } else {
      cachedToken = null;
      tokenExpiresAt = 0;
    }
  });
};

// Khởi tạo ngay khi module load
initializeToken();

// Request interceptor - thêm token vào headers (SYNC, không gọi API)
api.interceptors.request.use(
  (config) => {
    // Kiểm tra xem có phải request admin không
    const isAdminRequest = config.url?.includes("/admin/");

    let token: string | null = null;

    if (isAdminRequest) {
      // Admin routes: lấy từ localStorage
      token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    } else {
      // User routes: sử dụng cached token (không gọi API)
      token = cachedToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response success:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataPreview: typeof response.data === "object" ? Object.keys(response.data) : response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      isNetworkError: !error.response && error.request,
    });

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - xóa token và redirect đến login
          const isAdminRoute = error.config?.url?.includes("/admin/");

          if (isAdminRoute) {
            // Admin unauthorized - xóa admin token và redirect về admin login
            if (typeof window !== "undefined") {
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_user");
              if (!window.location.pathname.includes("/admin/login")) {
                window.location.href = "/admin/login";
              }
            }
          } else {
            // User unauthorized - xóa user token
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              if (!window.location.pathname.includes("/login")) {
                // window.location.href = '/login';
              }
            }
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
