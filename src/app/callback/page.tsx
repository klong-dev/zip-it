"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/user-store";

export default function CallbackPage() {
  const router = useRouter();
  const { fetchUser, getRedirectAfterLogin, clearRedirectAfterLogin } = useUserStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý đăng nhập...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL hash (for OAuth) or from query params (for email confirmation)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage("Đã xảy ra lỗi khi xử lý đăng nhập. Vui lòng thử lại.");
          return;
        }

        if (data.session) {
          // Successfully authenticated
          await fetchUser();
          setStatus("success");
          setMessage("Đăng nhập thành công! Đang chuyển hướng...");

          // Get redirect URL if saved
          const redirectUrl = getRedirectAfterLogin() || "/";
          clearRedirectAfterLogin();

          // Redirect after a short delay
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
        } else {
          // Check if this is an email confirmation callback
          const url = new URL(window.location.href);
          const type = url.searchParams.get("type");

          if (type === "signup") {
            setStatus("success");
            setMessage("Email đã được xác nhận! Đang chuyển đến trang đăng nhập...");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else if (type === "recovery") {
            setStatus("success");
            setMessage("Đang chuyển đến trang đặt lại mật khẩu...");
            setTimeout(() => {
              router.push("/reset-password");
            }, 1000);
          } else {
            // No session and not a known callback type
            setStatus("error");
            setMessage("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        }
      } catch (err) {
        console.error("Callback handling error:", err);
        setStatus("error");
        setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    };

    handleCallback();
  }, [router, fetchUser, getRedirectAfterLogin, clearRedirectAfterLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f6f6] to-white flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <img src="/logo.png" alt="ZIP" className="h-12 mx-auto mb-6" />

        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-[#980b15] mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">{message}</p>
            <button onClick={() => router.push("/login")} className="px-6 py-2 bg-[#980b15] text-white rounded-lg hover:bg-[#7a0912] transition-colors">
              Quay lại đăng nhập
            </button>
          </>
        )}
      </div>
    </div>
  );
}
