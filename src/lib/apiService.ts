import api from "./api";

// ==================== AUTH APIs ====================
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};

// ==================== PRODUCTS APIs ====================
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  priceRange?: string;
  image: string;
  images: string[];
  category: string;
  description: string;
  detailedDescription: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  sku: string;
  tags: string[];
  specifications: {
    material: string;
    size: string;
    weight: string;
    color: string;
  };
  customizationOptions?: Array<{
    id: number;
    type: string;
    name: string;
    price: number;
    description: string;
  }>;
  relatedProducts?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  image: string;
}

export const productsAPI = {
  getAll: async (filters?: ProductsFilters): Promise<ProductsResponse> => {
    const response = await api.get("/products", { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<{ success: boolean; data: Product }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await api.get("/products/categories");
    return response.data;
  },
};

// ==================== PAYMENT APIs ====================
export interface PaymentItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    type?: string;
    text?: string;
    price?: number;
    size?: string;
    color?: string;
    [key: string]: any;
  } | null;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  address: string;
}

export interface CreatePaymentData {
  items: PaymentItem[];
  customerInfo: CustomerInfo;
  note?: string;
  voucherCode?: string;
  totalPrice: number;
  shippingFee: number;
  discount: number;
  finalTotal: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
    orderCode: number;
    orderNumber: string;
    qrCode: string;
    amount: number;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    orderCode: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    amount: number;
    paidAt: string | null;
    transactionId: string | null;
  };
}

export const paymentAPI = {
  create: async (data: CreatePaymentData): Promise<PaymentResponse> => {
    const response = await api.post("/payment/create", data);
    return response.data;
  },

  getStatus: async (orderCode: string): Promise<PaymentStatusResponse> => {
    const response = await api.get(`/payment/status/${orderCode}`);
    return response.data;
  },
};

// ==================== ORDERS APIs ====================
export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalPayment: number;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
  }>;
  createdAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    customization?: any;
  }>;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    address: string;
    district: string;
    province: string;
  };
  note?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalPayment: number;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export const ordersAPI = {
  getAll: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await api.get("/orders", { params: { page, limit } });
    return response.data;
  },

  getById: async (id: number): Promise<OrderDetail> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

// ==================== CART APIs (Optional - for multi-device sync) ====================
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const cartAPI = {
  get: async (): Promise<CartResponse> => {
    const response = await api.get("/cart");
    return response.data;
  },

  addItem: async (data: { productId: number; quantity: number; customization?: any }): Promise<{ message: string; item: CartItem }> => {
    const response = await api.post("/cart/items", data);
    return response.data;
  },

  updateItem: async (id: number, quantity: number): Promise<{ message: string }> => {
    const response = await api.patch(`/cart/items/${id}`, { quantity });
    return response.data;
  },

  deleteItem: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/cart/items/${id}`);
    return response.data;
  },

  clear: async (): Promise<{ message: string }> => {
    const response = await api.delete("/cart");
    return response.data;
  },
};

// ==================== USER APIs ====================
export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

export const userAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/users/profile");
    return response.data;
  },
};

// ==================== ADMIN APIs ====================
export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  priceFormatted: string;
  image: string;
  images: string[];
  category: string;
  description: string;
  detailedDescription: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  specifications: any;
  customizationOptions: any[];
  relatedProducts: number[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductsFilters {
  category?: string;
  search?: string;
  inStock?: boolean;
}

export interface AdminProductsResponse {
  success: boolean;
  data: {
    products: AdminProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export interface CreateProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  detailedDescription?: string;
  tags?: string;
  specifications?: string;
  customizationOptions?: string;
  relatedProducts?: string;
  rating?: number;
  reviews?: number;
  images?: File[];
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  stock?: number;
  inStock?: boolean;
  description?: string;
  detailedDescription?: string;
  category?: string;
  tags?: string;
  specifications?: string;
  customizationOptions?: string;
  relatedProducts?: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPayment: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface AdminOrderDetail {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    district: string;
    province: string;
  };
  note?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalPayment: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  items: Array<{
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    customization?: any;
    product: {
      id: number;
      name: string;
      image: string;
    };
  }>;
}

export interface AdminOrdersFilters {
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface OrderStatistics {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  statusCounts: Array<{
    status: string;
    count: number;
  }>;
}

export interface DashboardStats {
  orders: {
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    statusCounts: Array<{
      status: string;
      count: number;
    }>;
  };
  products: {
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    categories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    averagePrice: number;
  };
  users: {
    totalUsers: number;
    usersByRole: Array<{
      role: string;
      count: number;
    }>;
    newUsersLast30Days: number;
  };
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  period: {
    type: string;
    fromDate: string;
    toDate: string;
  };
  revenueByPaymentMethod: Array<{
    paymentMethod: string;
    revenue: number;
    orderCount: number;
    percentage: number;
  }>;
}

export interface ProductStatistics {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  categories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  averagePrice: number;
  priceRanges: Array<{
    range: string;
    count: number;
  }>;
  topRatedProducts: Array<{
    id: number;
    name: string;
    rating: number;
    reviews: number;
    price: number;
  }>;
}

export const adminAPI = {
  // Auth
  login: async (data: AdminLoginData): Promise<AdminAuthResponse> => {
    console.log("Admin login request data:", data);
    const response = await api.post("/admin/auth/login", data);
    console.log("Admin login response:", response);
    console.log("Admin login response.data:", response.data);
    return response.data;
  },

  // Products
  products: {
    getAll: async (filters?: AdminProductsFilters): Promise<AdminProductsResponse> => {
      const response = await api.get("/admin/products", { params: filters });
      return response.data;
    },

    getById: async (id: number): Promise<AdminProduct> => {
      const response = await api.get(`/admin/products/${id}`);
      return response.data;
    },

    create: async (data: FormData): Promise<AdminProduct> => {
      const response = await api.post("/admin/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    update: async (id: number, data: UpdateProductData): Promise<AdminProduct> => {
      const response = await api.put(`/admin/products/${id}`, data);
      return response.data;
    },

    updateStock: async (id: number, stock: number, inStock: boolean): Promise<AdminProduct> => {
      const response = await api.put(`/admin/products/${id}/stock`, { stock, inStock });
      return response.data;
    },

    delete: async (id: number): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    },
  },

  // Orders
  orders: {
    getAll: async (filters?: AdminOrdersFilters): Promise<AdminOrder[]> => {
      const response = await api.get("/admin/orders", { params: filters });
      return response.data;
    },

    getById: async (id: number): Promise<AdminOrderDetail> => {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data;
    },

    updateStatus: async (id: number, status: string, note?: string): Promise<AdminOrderDetail> => {
      const response = await api.put(`/admin/orders/${id}/status`, { status, note });
      return response.data;
    },

    delete: async (id: number): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(`/admin/orders/${id}`);
      return response.data;
    },

    getStatistics: async (): Promise<OrderStatistics> => {
      const response = await api.get("/admin/orders/statistics");
      return response.data;
    },
  },

  // Statistics
  statistics: {
    getDashboard: async (): Promise<DashboardStats> => {
      const response = await api.get("/admin/statistics/dashboard");
      return response.data;
    },

    getRevenue: async (period?: string, fromDate?: string, toDate?: string): Promise<RevenueAnalytics> => {
      const response = await api.get("/admin/statistics/revenue", {
        params: { period, fromDate, toDate },
      });
      return response.data;
    },

    getProducts: async (): Promise<ProductStatistics> => {
      const response = await api.get("/admin/statistics/products");
      return response.data;
    },

    getTopProducts: async (limit = 10): Promise<AdminProduct[]> => {
      const response = await api.get("/admin/statistics/top-products", { params: { limit } });
      return response.data;
    },

    getLowStock: async (threshold = 10): Promise<AdminProduct[]> => {
      const response = await api.get("/admin/statistics/low-stock", { params: { threshold } });
      return response.data;
    },
  },
};

// ==================== CONTACT APIs ====================
export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export const contactAPI = {
  create: async (data: ContactData): Promise<ContactResponse> => {
    const response = await api.post("/admin/contacts", data);
    return response.data;
  },
  getAll: async (): Promise<ContactResponse[]> => {
    const response = await api.get("/admin/contacts");
    return response.data;
  },
};
