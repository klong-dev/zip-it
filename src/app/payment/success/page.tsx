"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(true);

  // Lấy orderCode từ query params (được PayOS redirect về)
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    if (!orderCode) {
      // Nếu không có orderCode, redirect về trang chủ
      window.location.href = "/";
      return;
    }

    let timeoutId: NodeJS.Timeout;

    // Kiểm tra trạng thái thanh toán từ backend
    const checkPaymentStatus = async () => {
      // Nếu đã dừng polling thì không check nữa
      if (!isPolling) return;

      try {
        const { paymentAPI } = await import("@/lib/apiService");
        const response = await paymentAPI.getStatus(orderCode);

        if (response.success) {
          setPaymentInfo(response.data);

          // Kiểm tra paymentStatus
          if (response.data.paymentStatus === "COMPLETED") {
            // Thanh toán đã hoàn thành - DỪNG kiểm tra
            setIsPolling(false);
            clearCart();
            localStorage.removeItem("pendingOrderCode");
            setLoading(false);
          } else if (response.data.paymentStatus === "PENDING" || response.data.paymentStatus === "PROCESSING") {
            // Vẫn đang xử lý, check lại sau 2 giây
            timeoutId = setTimeout(checkPaymentStatus, 2000);
          } else {
            // Thanh toán thất bại hoặc trạng thái khác
            setIsPolling(false);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setIsPolling(false);
        setLoading(false);
      }
    };

    checkPaymentStatus();

    // Cleanup function để clear timeout khi component unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsPolling(false);
    };
  }, [orderCode, clearCart, isPolling]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fefeff]">
        <Header />
        <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-[#74787c]">Đang xử lý thanh toán...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!paymentInfo || paymentInfo.paymentStatus !== "COMPLETED") {
    // Nếu không thành công, redirect đến trang failed
    if (typeof window !== "undefined") {
      window.location.href = `/payment/failed?orderCode=${orderCode}`;
    }
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fefeff]">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh Toán Thành Công!</h1>

          <p className="text-[#74787c] mb-6">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>

          <div className="bg-[#f6f6f7] p-4 rounded-lg mb-4">
            <p className="text-sm text-[#74787c] mb-2">Mã đơn hàng:</p>
            <p className="text-xl font-bold text-[#980b15]">{paymentInfo.orderNumber}</p>
          </div>

          <div className="bg-[#f6f6f7] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#74787c] mb-2">Số tiền đã thanh toán:</p>
            <p className="text-xl font-bold text-[#111111]">{new Intl.NumberFormat("vi-VN").format(paymentInfo.amount)}đ</p>
          </div>

          {paymentInfo.paidAt && (
            <div className="bg-[#f6f6f7] p-4 rounded-lg mb-6">
              <p className="text-sm text-[#74787c] mb-2">Thời gian thanh toán:</p>
              <p className="text-sm font-medium text-[#111111]">{new Date(paymentInfo.paidAt).toLocaleString("vi-VN")}</p>
            </div>
          )}

          <div className="bg-[#e8f5e9] border border-[#4caf50] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#2e7d32]">
              📧 Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
              <br />
              📦 Đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/shop">
              <Button className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6">TIẾP TỤC MUA SẮM</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-[#111111] text-[#111111] hover:bg-[#ebebeb]">
                VỀ TRANG CHỦ
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
