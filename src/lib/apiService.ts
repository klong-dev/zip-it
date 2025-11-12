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
