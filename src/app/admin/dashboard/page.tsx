"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, LogOut, LayoutDashboard, TrendingUp, AlertTriangle, Mail } from "lucide-react";
import Link from "next/link";
import { adminAPI, DashboardStats } from "@/lib/apiService";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["#980b15", "#e63946", "#f77f00", "#06a77d", "#4361ee", "#7209b7"];

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "#fbbf24",
  COMPLETED: "#10b981",
  PROCESSING: "#3b82f6",
  SHIPPING: "#8b5cf6",
  DELIVERED: "#059669",
  CANCELLED: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  COMPLETED: "Đã thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      setAdminUser(JSON.parse(user));
    }

    loadDashboardStats();
  }, [router]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.statistics.getDashboard();
      setStats(data);
    } catch (error: any) {
      toast.error("Không thể tải thống kê dashboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    // Remove cookie
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#980b15]" />
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">ZIP IT Admin</h1>
              <p className="text-sm text-[#74787c]">Quản lý hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-[#111111]">{adminUser.name}</p>
              <p className="text-xs text-[#74787c]">{adminUser.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#111111] mb-6">Dashboard</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#111111]">{stats?.products.totalProducts || 0}</span>
                </div>
                <p className="text-sm text-[#74787c] mb-1">Tổng sản phẩm</p>
                <p className="text-xs text-green-600">{stats?.products.inStockProducts || 0} còn hàng</p>
              </Card>

              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#111111]">{stats?.orders.totalOrders || 0}</span>
                </div>
                <p className="text-sm text-[#74787c] mb-1">Tổng đơn hàng</p>
                <p className="text-xs text-green-600">{stats?.orders.paidOrders || 0} đã thanh toán</p>
              </Card>

              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#111111]">{stats?.users.totalUsers || 0}</span>
                </div>
                <p className="text-sm text-[#74787c] mb-1">Khách hàng</p>
                <p className="text-xs text-green-600">+{stats?.users.newUsersLast30Days || 0} (30 ngày)</p>
              </Card>

              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-xl font-bold text-[#111111]">{formatCurrency(stats?.orders.totalRevenue || 0).slice(0, -2)}</span>
                </div>
                <p className="text-sm text-[#74787c]">Tổng doanh thu</p>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Order Status Chart */}
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#980b15]" />
                  Trạng thái đơn hàng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.orders.statusCounts.map((item) => ({ ...item, name: STATUS_LABELS[item.status] || item.status }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#980b15" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Product Categories Chart */}
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#980b15]" />
                  Phân loại sản phẩm
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats?.products.categories} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.category}: ${entry.percentage}%`}>
                      {stats?.products.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Warning: Low Stock */}
            {stats && stats.products.outOfStockProducts > 0 && (
              <Card className="p-6 bg-yellow-50 border-yellow-200 mb-8">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-bold text-[#111111]">Cảnh báo tồn kho</h3>
                    <p className="text-sm text-[#74787c]">Có {stats.products.outOfStockProducts} sản phẩm hết hàng. Vui lòng cập nhật kho.</p>
                  </div>
                  <Link href="/admin/products" className="ml-auto">
                    <Button className="bg-[#980b15] hover:bg-[#7a0911] text-white">Kiểm tra ngay</Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <h3 className="text-xl font-bold text-[#111111] mb-4">Quản lý</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin/products">
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#980b15]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#980b15] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Package className="w-7 h-7 text-[#980b15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111]">Quản lý Sản phẩm</h4>
                      <p className="text-sm text-[#74787c]">Thêm, sửa, xóa sản phẩm</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#980b15]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#980b15] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-7 h-7 text-[#980b15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111]">Quản lý Đơn hàng</h4>
                      <p className="text-sm text-[#74787c]">Xem và xử lý đơn hàng</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/contacts">
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#980b15]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#980b15] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Mail className="w-7 h-7 text-[#980b15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111]">Quản lý Liên hệ</h4>
                      <p className="text-sm text-[#74787c]">Xem các yêu cầu liên hệ</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/dashboard">
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#980b15]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#980b15] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-[#980b15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111]">Thống kê</h4>
                      <p className="text-sm text-[#74787c]">Xem báo cáo chi tiết</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
