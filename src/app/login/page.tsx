"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { authHelpers, supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { user, fetchUser, getRedirectAfterLogin, clearRedirectAfterLogin } = useUserStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const redirectUrl = getRedirectAfterLogin() || "/";
        clearRedirectAfterLogin();
        router.push(redirectUrl);
      }
    };
    checkAuth();
  }, [router, getRedirectAfterLogin, clearRedirectAfterLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await authHelpers.signInWithEmail(formData.email, formData.password);
        if (error) {
          toast.error(error.message || "Đăng nhập thất bại");
        } else {
          await fetchUser();
          toast.success("Đăng nhập thành công!");
          const redirectUrl = getRedirectAfterLogin() || "/";
          clearRedirectAfterLogin();
          router.push(redirectUrl);
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
          setLoading(false);
          return;
        }

        const { error } = await authHelpers.signUpWithEmail(formData.fullName, formData.email, formData.password);

        if (error) {
          toast.error(error.message || "Đăng ký thất bại");
        } else {
          toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setOauthLoading(provider);
    try {
      const { error } = await authHelpers.signInWithOAuth(provider);
      if (error) {
        toast.error(`Đăng nhập ${provider === "google" ? "Google" : "Facebook"} thất bại`);
        setOauthLoading(null);
      }
      // OAuth will redirect, so no need to handle success here
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      setOauthLoading(null);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Vui lòng nhập email để đặt lại mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authHelpers.resetPassword(formData.email);
      if (error) {
        toast.error(error.message || "Không thể gửi email đặt lại mật khẩu");
      } else {
        toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f6f6] to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#980b15] hover:text-[#7a0912] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="ZIP" className="h-12 mx-auto mb-4" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}</h1>
            <p className="text-gray-500 mt-2">{isLogin ? "Đăng nhập để quản lý đơn hàng và địa chỉ giao hàng" : "Tạo tài khoản để mua sắm dễ dàng hơn"}</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button type="button" onClick={() => handleOAuthLogin("google")} disabled={!!oauthLoading || loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {oauthLoading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="font-medium text-gray-700">{isLogin ? "Đăng nhập với Google" : "Đăng ký với Google"}</span>
            </button>

            <button type="button" onClick={() => handleOAuthLogin("facebook")} disabled={!!oauthLoading || loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {oauthLoading === "facebook" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span className="font-medium">{isLogin ? "Đăng nhập với Facebook" : "Đăng ký với Facebook"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required={!isLogin} placeholder="Nguyễn Văn A" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="example@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required placeholder="••••••••" className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!isLogin} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" onClick={handleForgotPassword} className="text-sm text-[#980b15] hover:text-[#7a0912] font-medium">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading || !!oauthLoading} className="w-full py-3 bg-[#980b15] text-white rounded-lg font-medium hover:bg-[#7a0912] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
              }}
              className="text-[#980b15] hover:text-[#7a0912] font-medium"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
