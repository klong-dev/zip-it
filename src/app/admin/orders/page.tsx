"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ordersAPI, Order } from "@/lib/apiService";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Kiểm tra authentication
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadOrders();
  }, [router, currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll(currentPage, 20);
      setOrders(response.orders);
      setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
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

  const filteredOrders = orders.filter((order) => order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-[#111111]">Quản lý Đơn hàng</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="p-6 bg-white mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#74787c] w-5 h-5" />
              <Input placeholder="Tìm kiếm theo mã đơn hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" className="border-[#980b15] text-[#980b15]">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-[#74787c]">Đang tải dữ liệu...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#74787c]">Không có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx}>
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && <div className="text-[#74787c]">+{order.items.length - 2} sản phẩm khác</div>}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{new Intl.NumberFormat("vi-VN").format(order.totalPayment)}đ</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-[#ebebeb] flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                    Trước
                  </Button>
                  <span className="text-sm text-[#74787c]">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
