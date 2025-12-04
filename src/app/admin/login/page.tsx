"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { adminAPI } from "@/lib/apiService";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 Attempting admin login with:", formData.email);
      const response = await adminAPI.login(formData);
      console.log("✅ Login response received:", response);

      // Lưu token vào localStorage và cookies
      localStorage.setItem("admin_token", response.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(response.user));

      // Set cookie for middleware
      document.cookie = `admin_token=${response.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

      toast.success(`Xin chào ${response.user.name}! Đăng nhập thành công.`);

      // Redirect đến trang admin dashboard - dùng replace để không thể back lại
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("❌ Login error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config,
      });

      if (error.response?.status === 401) {
        toast.error("Email hoặc mật khẩu không đúng!");
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập trang quản trị!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#980b15] to-[#7a0808] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#980b15] mb-2">ZIP IT ADMIN</h1>
          <p className="text-[#74787c]">Đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#74787c] w-5 h-5" />
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="admin@zipit.com" className="pl-10" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#74787c] w-5 h-5" />
              <Input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="pl-10" required />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6 text-lg">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              "ĐĂNG NHẬP"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#74787c]">Chỉ dành cho quản trị viên</p>
          <p className="text-xs text-[#74787c] mt-2">Tài khoản mặc định: admin@zipit.com</p>
        </div>
      </div>
    </div>
  );
}
