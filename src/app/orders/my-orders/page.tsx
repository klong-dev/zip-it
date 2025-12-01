"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Loader2, ChevronRight, Clock, CheckCircle, XCircle, Truck, CreditCard, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/user-store";
import { ordersAPI } from "@/lib/apiService";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: number;
  order_code: string;
  status: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward?: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  awaiting_payment: { label: "Chờ thanh toán", color: "bg-orange-100 text-orange-700", icon: CreditCard },
  paid: { label: "Đã thanh toán", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "Đang xử lý", color: "bg-purple-100 text-purple-700", icon: RefreshCw },
  shipping: { label: "Đang giao hàng", color: "bg-cyan-100 text-cyan-700", icon: Truck },
  delivered: { label: "Đã giao hàng", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "Đã hoàn tiền", color: "bg-gray-100 text-gray-700", icon: RefreshCw },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading: userLoading, fetchUser } = useUserStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Chỉ check auth một lần
    if (authChecked) return;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Save redirect URL and redirect to login
        sessionStorage.setItem("redirectAfterLogin", "/orders/my-orders");
        router.push("/login");
        return;
      }
      setAuthChecked(true);
      loadOrders();
    };
    checkAuth();
  }, [router, authChecked]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getMyOrders();
      if (response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "paid" || status === "awaiting_payment" || status === "pending";
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");
      // Reload orders
      loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (userLoading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#980b15]" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f6f6f6]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-[#980b15] hover:text-[#7a0912] mb-2 text-sm">
                <ArrowLeft className="w-4 h-4" />
                Quay lại trang chủ
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Package className="w-7 h-7 text-[#980b15]" />
                Đơn hàng của tôi
              </h1>
            </div>
            <button onClick={loadOrders} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm bg-white rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#980b15]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#980b15] text-white rounded-lg hover:bg-[#7a0912] transition-colors">
                Mua sắm ngay
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800">#{order.order_code}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Đặt ngày: {formatDate(order.created_at)}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="font-bold text-[#980b15]">{formatPrice(order.total_amount)}</p>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {/* Items */}
                        <div className="p-4 sm:p-6 space-y-4">
                          <h4 className="font-medium text-gray-800">Sản phẩm</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              {item.image_url && <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg" />}
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.product_name}</p>
                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address */}
                        {order.shipping_address && (
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <h4 className="font-medium text-gray-800 mb-2">Địa chỉ giao hàng</h4>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                              <p className="font-medium text-gray-800">{order.shipping_address.full_name}</p>
                              <p>{order.shipping_address.phone}</p>
                              <p>{order.shipping_address.address}</p>
                              <p>
                                {order.shipping_address.ward && `${order.shipping_address.ward}, `}
                                {order.shipping_address.district}, {order.shipping_address.province}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {canCancelOrder(order.status) && (
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg mb-4">
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                              <p className="text-sm text-yellow-700">Bạn có thể hủy đơn hàng này vì đơn hàng chưa được xử lý.</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                              }}
                              disabled={cancellingOrder === order.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {cancellingOrder === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              Hủy đơn hàng
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
