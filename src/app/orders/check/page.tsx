"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Phone, Calendar, DollarSign, MapPin, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

interface Order {
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
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPING: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  COMPLETED: "Đã thanh toán",
  FAILED: "Thất bại",
};

export default function OrderCheckPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }

    // Validate phone number (basic)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const response = await api.get(`/orders/check?phone=${encodeURIComponent(phone)}`);
      const ordersData = response.data?.data || [];
      setOrders(ordersData);

      if (ordersData.length === 0) {
        toast.info("Không tìm thấy đơn hàng nào với số điện thoại này.");
      } else {
        toast.success(`Tìm thấy ${ordersData.length} đơn hàng!`);
      }
    } catch (error: any) {
      console.error("Error checking orders:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi kiểm tra đơn hàng!");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className={(STATUS_COLORS[status] || "bg-gray-100 text-gray-800") + " border-none"}>{STATUS_LABELS[status] || status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return <Badge className={(colors[status] || "bg-gray-100 text-gray-800") + " border-none"}>{PAYMENT_STATUS_LABELS[status] || status}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#980b15] py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h2 className="text-[200px] font-bold text-white tracking-wider" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            KIỂM TRA
          </h2>
        </div>
        <div className="relative z-10 text-center">
          <Package className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">KIỂM TRA ĐỚN HÀNG</h1>
          <p className="text-white text-lg">Nhập số điện thoại để tra cứu đơn hàng của bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Search Form */}
          <Card className="p-8 bg-white shadow-lg mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-lg font-semibold text-[#111111] mb-3">
                  <Phone className="w-5 h-5 inline mr-2" />
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại đặt hàng (VD: 0912345678)" className="flex-1 text-lg py-6 border-[#d9d9d9] focus:border-[#980b15]" />
                  <Button type="submit" disabled={loading} className="bg-[#980b15] hover:bg-[#7a0911] text-white px-8 py-6 text-lg">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Kiểm tra
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-[#74787c] mt-2">Nhập số điện thoại mà bạn đã sử dụng khi đặt hàng</p>
              </div>
            </form>
          </Card>

          {/* Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searched && orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-[#74787c] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#111111] mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-[#74787c]">Không có đơn hàng nào được tìm thấy với số điện thoại này.</p>
            </Card>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#111111]">Tìm thấy {orders.length} đơn hàng</h2>
              </div>

              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Order Header */}
                  <div className="bg-[#f6f6f7] p-6 border-b border-[#ebebeb]">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#980b15] mb-2">{order.orderNumber}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#74787c]">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-bold text-[#111111] mb-3">Thông tin khách hàng</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#74787c]" />
                            <span className="text-[#111111]">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#74787c]" />
                            <span className="text-[#111111]">{order.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#74787c]" />
                            <span className="text-[#111111]">{order.customerEmail || "-"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-bold text-[#111111] mb-3">Địa chỉ giao hàng</h4>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#74787c] mt-1" />
                          <div className="text-[#111111]">
                            <p>{order.shippingAddress?.address || "-"}</p>
                            <p>
                              {order.shippingAddress?.district || "-"}, {order.shippingAddress?.province || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-bold text-[#111111] mb-3">Sản phẩm</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-[#f6f6f7] rounded-lg">
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
                              <img src={item.product.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-[#111111]">{item.productName}</p>
                              <p className="text-sm text-[#74787c]">
                                Số lượng: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <div className="font-bold text-[#980b15]">{formatCurrency(item.subtotal)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-[#ebebeb] pt-4">
                      <div className="space-y-2 max-w-md ml-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#74787c]">Tạm tính:</span>
                          <span className="text-[#111111]">{formatCurrency(order.items.reduce((sum, item) => sum + (item.subtotal || 0), 0))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#74787c]">Phí vận chuyển:</span>
                          <span className="text-[#111111]">{formatCurrency(30000)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#74787c]">Giảm giá:</span>
                            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t border-[#ebebeb] pt-2">
                          <span className="text-[#111111]">Tổng cộng:</span>
                          <span className="text-[#980b15]">{formatCurrency(order.totalPayment)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-[#74787c]">
                          <strong>Ghi chú:</strong> {order.note}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          {/* Help Section */}
          {!searched && (
            <Card className="p-8 bg-gradient-to-br from-[#980b15] to-[#7a0911] text-white">
              <h3 className="text-2xl font-bold mb-4">💡 Hướng dẫn kiểm tra đơn hàng</h3>
              <div className="space-y-3 text-sm">
                <p>• Nhập số điện thoại mà bạn đã sử dụng khi đặt hàng</p>
                <p>• Hệ thống sẽ hiển thị tất cả đơn hàng liên quan đến số điện thoại này</p>
                <p>• Bạn có thể xem chi tiết trạng thái, sản phẩm và thông tin giao hàng</p>
                <p>• Nếu cần hỗ trợ thêm, vui lòng liên hệ: 0834946906</p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
