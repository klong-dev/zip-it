"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();

  // Lấy thông tin từ query params
  const orderCode = searchParams.get("orderCode");
  const reason = searchParams.get("reason") || "Không xác định";

  return (
    <div className="min-h-screen flex flex-col bg-[#fefeff]">
      <Header />

      <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh Toán Thất Bại</h1>

          <p className="text-[#74787c] mb-6">Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.</p>

          {orderCode && (
            <div className="bg-[#f6f6f7] p-4 rounded-lg mb-6">
              <p className="text-sm text-[#74787c] mb-2">Mã đơn hàng:</p>
              <p className="text-xl font-bold text-[#980b15]">{orderCode}</p>
            </div>
          )}

          <div className="bg-[#ffebee] border border-[#f44336] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#c62828]">
              <strong>Lý do:</strong> {reason}
            </p>
          </div>

          <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#856404]">
              💡 <strong>Lưu ý:</strong>
              <br />
              - Kiểm tra lại thông tin thẻ/tài khoản
              <br />
              - Đảm bảo có đủ số dư
              <br />
              - Liên hệ ngân hàng nếu vấn đề vẫn tiếp diễn
              <br />- Hotline: 0945000334
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/checkout">
              <Button className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6">THỬ LẠI THANH TOÁN</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full border-[#111111] text-[#111111] hover:bg-[#ebebeb]">
                QUAY LẠI GIỎ HÀNG
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="ghost" className="w-full text-[#74787c] hover:text-[#111111]">
                TIẾP TỤC MUA SẮM
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
