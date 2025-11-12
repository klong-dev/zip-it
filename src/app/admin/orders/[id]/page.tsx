"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";
import { ordersAPI, OrderDetail } from "@/lib/apiService";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra authentication
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadOrderDetail();
  }, [router, resolvedParams.id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(parseInt(resolvedParams.id));
      setOrder(response);
    } catch (error) {
      console.error("Error loading order detail:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
      PROCESSING: { label: "Đang xử lý", className: "bg-purple-100 text-purple-800" },
      SHIPPING: { label: "Đang giao", className: "bg-orange-100 text-orange-800" },
      DELIVERED: { label: "Đã giao", className: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };

    return <Badge className={`${config.className} border-none`}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ thanh toán", className: "bg-yellow-100 text-yellow-800" },
      COMPLETED: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      FAILED: { label: "Thất bại", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };

    return <Badge className={`${config.className} border-none`}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center">
        <p className="text-[#74787c]">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">Chi tiết đơn hàng</h1>
                <p className="text-sm text-[#74787c]">{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Sản phẩm ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-[#ebebeb] last:border-0">
                    <div className="w-20 h-20 bg-[#f6f6f7] rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#111111]">{item.name}</h3>
                      <p className="text-sm text-[#74787c]">
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ x {item.quantity}
                      </p>
                      {item.customization && <p className="text-xs text-[#980b15] mt-1">Tùy chỉnh: {JSON.stringify(item.customization)}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#111111]">{new Intl.NumberFormat("vi-VN").format(item.subtotal)}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin khách hàng
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#74787c]">Họ tên</p>
                  <p className="font-medium text-[#111111]">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c]">Số điện thoại</p>
                  <p className="font-medium text-[#111111]">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c]">Email</p>
                  <p className="font-medium text-[#111111]">{order.customerEmail}</p>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Địa chỉ giao hàng
              </h2>
              <p className="text-[#111111]">
                {order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.province}
              </p>
              {order.note && (
                <div className="mt-4 pt-4 border-t border-[#ebebeb]">
                  <p className="text-sm text-[#74787c] mb-1">Ghi chú:</p>
                  <p className="text-[#111111]">{order.note}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4">Tổng quan đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#74787c]">Tạm tính:</span>
                  <span className="font-medium text-[#111111]">{new Intl.NumberFormat("vi-VN").format(order.subtotal)}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74787c]">Phí vận chuyển:</span>
                  <span className="font-medium text-[#111111]">{new Intl.NumberFormat("vi-VN").format(order.shippingFee)}đ</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-medium">-{new Intl.NumberFormat("vi-VN").format(order.discount)}đ</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#ebebeb] flex justify-between">
                  <span className="font-bold text-[#111111]">Tổng cộng:</span>
                  <span className="font-bold text-[#980b15] text-xl">{new Intl.NumberFormat("vi-VN").format(order.totalPayment)}đ</span>
                </div>
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thanh toán
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#74787c]">Trạng thái</p>
                  <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
                </div>
                {order.transactionId && (
                  <div>
                    <p className="text-sm text-[#74787c]">Mã giao dịch</p>
                    <p className="font-medium text-[#111111]">{order.transactionId}</p>
                  </div>
                )}
                {order.paidAt && (
                  <div>
                    <p className="text-sm text-[#74787c]">Thời gian thanh toán</p>
                    <p className="font-medium text-[#111111]">{new Date(order.paidAt).toLocaleString("vi-VN")}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thời gian
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-[#74787c]">Đặt hàng</p>
                  <p className="font-medium text-[#111111]">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
