"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-[#111111]">245</span>
            </div>
            <p className="text-sm text-[#74787c]">Tổng sản phẩm</p>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-[#111111]">128</span>
            </div>
            <p className="text-sm text-[#74787c]">Đơn hàng mới</p>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-[#111111]">1,234</span>
            </div>
            <p className="text-sm text-[#74787c]">Khách hàng</p>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-[#111111]">125M</span>
            </div>
            <p className="text-sm text-[#74787c]">Doanh thu (VNĐ)</p>
          </Card>
        </div>

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

          <Link href="/admin/customers">
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#980b15]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#980b15] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Users className="w-7 h-7 text-[#980b15]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#111111]">Quản lý Khách hàng</h4>
                  <p className="text-sm text-[#74787c]">Xem danh sách khách hàng</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
