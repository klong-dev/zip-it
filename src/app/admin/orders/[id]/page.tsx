"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Edit } from "lucide-react";
import Link from "next/link";
import { adminAPI, AdminOrderDetail } from "@/lib/apiService";
import { toast } from "sonner";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
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
      const response = await adminAPI.orders.getById(parseInt(resolvedParams.id));
      setOrder(response);
      setNewStatus(response.status);
    } catch (error: any) {
      toast.error("Không thể tải chi tiết đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      await adminAPI.orders.updateStatus(order.id, newStatus, statusNote || undefined);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setIsUpdateDialogOpen(false);
      setStatusNote("");
      loadOrderDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className={`${STATUS_COLORS[status] || "bg-gray-100 text-gray-800"} border-none text-sm px-3 py-1`}>{STATUS_LABELS[status] || status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return <Badge className={`${colors[status] || "bg-gray-100 text-gray-800"} border-none text-sm px-3 py-1`}>{PAYMENT_STATUS_LABELS[status] || status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
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
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              {getPaymentStatusBadge(order.paymentStatus)}
              <Button onClick={() => setIsUpdateDialogOpen(true)} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
                <Edit className="w-4 h-4 mr-2" />
                Cập nhật trạng thái
              </Button>
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
                    <div className="w-20 h-20 bg-[#f6f6f7] rounded relative overflow-hidden flex-shrink-0">{item.product?.image && <Image src={item.product.image} alt={item.productName} fill className="object-cover" />}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#111111]">{item.productName}</h3>
                      <p className="text-sm text-[#74787c]">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                      {item.customization && (
                        <div className="mt-1 p-2 bg-[#f6f6f7] rounded text-xs">
                          <p className="text-[#980b15] font-medium">Tùy chỉnh:</p>
                          <p className="text-[#74787c]">{JSON.stringify(item.customization)}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#980b15]">{formatCurrency(item.subtotal)}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#74787c] mb-1">Họ tên</p>
                  <p className="font-medium text-[#111111]">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c] mb-1">Số điện thoại</p>
                  <p className="font-medium text-[#111111]">{order.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#74787c] mb-1">Email</p>
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
              <p className="text-[#111111] leading-relaxed">
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.district}, {order.shippingAddress.province}
              </p>
              {order.note && (
                <div className="mt-4 pt-4 border-t border-[#ebebeb]">
                  <p className="text-sm text-[#74787c] mb-2">Ghi chú từ khách hàng:</p>
                  <p className="text-[#111111] italic bg-[#f6f6f7] p-3 rounded">{order.note}</p>
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
                  <span className="font-medium text-[#111111]">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74787c]">Phí vận chuyển:</span>
                  <span className="font-medium text-[#111111]">{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-medium">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-[#980b15] flex justify-between">
                  <span className="font-bold text-[#111111] text-lg">Tổng cộng:</span>
                  <span className="font-bold text-[#980b15] text-xl">{formatCurrency(order.totalPayment)}</span>
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
                  <p className="text-sm text-[#74787c] mb-2">Phương thức</p>
                  <Badge className="bg-blue-100 text-blue-800 border-none">{order.paymentMethod}</Badge>
                </div>
                <div>
                  <p className="text-sm text-[#74787c] mb-2">Trạng thái</p>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
                {order.transactionId && (
                  <div>
                    <p className="text-sm text-[#74787c] mb-1">Mã giao dịch</p>
                    <p className="font-mono text-sm font-medium text-[#111111] bg-[#f6f6f7] p-2 rounded">{order.transactionId}</p>
                  </div>
                )}
                {order.paidAt && (
                  <div>
                    <p className="text-sm text-[#74787c] mb-1">Thời gian thanh toán</p>
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
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#74787c] mb-1">Đặt hàng</p>
                  <p className="font-medium text-[#111111]">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
                {order.paidAt && (
                  <div>
                    <p className="text-sm text-[#74787c] mb-1">Thanh toán</p>
                    <p className="font-medium text-[#111111]">{new Date(order.paidAt).toLocaleString("vi-VN")}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>Thay đổi trạng thái xử lý đơn hàng #{order.orderNumber}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
              <Textarea id="note" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="Nhập ghi chú về việc cập nhật trạng thái..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
