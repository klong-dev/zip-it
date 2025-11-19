"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Filter, Home, Package, BarChart3 } from "lucide-react";
import Link from "next/link";
import { adminAPI, AdminOrder } from "@/lib/apiService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  COMPLETED: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  COMPLETED: "Đã thanh toán",
  FAILED: "Thất bại",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (paymentStatusFilter) filters.paymentStatus = paymentStatusFilter;
      if (searchTerm) filters.search = searchTerm;

      const response = await adminAPI.orders.getAll(filters);
      setOrders(response);
    } catch (error: any) {
      toast.error("Không thể tải danh sách đơn hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadOrders();
  };

  const getStatusBadge = (status: string) => {
    return <Badge className={`${STATUS_COLORS[status] || "bg-gray-100 text-gray-800"} border-none`}>{STATUS_LABELS[status] || status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return <Badge className={`${colors[status] || "bg-gray-100 text-gray-800"} border-none`}>{PAYMENT_STATUS_LABELS[status] || status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="icon">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">Quản lý Đơn hàng</h1>
                <p className="text-sm text-[#74787c]">Xem và xử lý đơn hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/products">
                <Button variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Sản phẩm
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="p-6 bg-white mb-6">
          {!loading && orders.length > 0 && (
            <Card className="mt-6 p-6 bg-white">
              <h3 className="font-bold text-[#111111] mb-4">Tổng quan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-[#74787c]">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-[#111111]">{orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c]">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-green-600">{orders.filter((o) => o.paymentStatus === "COMPLETED").length}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c]">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">{orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PROCESSING").length}</p>
                </div>
                <div>
                  <p className="text-sm text-[#74787c]">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-[#980b15]">{formatCurrency(orders.filter((o) => o.paymentStatus === "COMPLETED").reduce((sum, o) => sum + o.totalPayment, 0))}</p>
                </div>
              </div>
            </Card>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#74787c] w-5 h-5" />
              <Input placeholder="Tìm theo mã đơn, tên, email, số điện thoại..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} className="pl-10" />
            </div>
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter || "all"} onValueChange={(value) => setPaymentStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
              <Search className="w-4 h-4 mr-2" />
              Tìm
            </Button>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-[#74787c]">Đang tải dữ liệu...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#74787c] text-lg">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f6f6f7]">
                    <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                    <TableHead className="font-semibold">Khách hàng</TableHead>
                    <TableHead className="font-semibold">Liên hệ</TableHead>
                    <TableHead className="font-semibold">Ngày đặt</TableHead>
                    <TableHead className="font-semibold">Tổng tiền</TableHead>
                    <TableHead className="font-semibold">Thanh toán</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="text-right font-semibold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#f6f6f7] transition-colors">
                      <TableCell className="font-medium text-[#980b15]">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium text-[#111111]">{order.customerName}</div>
                        {order.user && <div className="text-xs text-[#74787c]">ID: {order.user.id}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-[#111111]">{order.customerEmail}</div>
                        <div className="text-sm text-[#74787c]">{order.customerPhone}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        <div className="text-xs text-[#74787c]">{new Date(order.createdAt).toLocaleTimeString("vi-VN")}</div>
                      </TableCell>
                      <TableCell className="font-bold text-[#980b15]">{formatCurrency(order.totalPayment)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button size="sm" variant="outline" className="border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
