"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const router = useRouter();

  const totalPrice = getTotalPrice();
  const shippingFee = totalPrice > 0 ? 30000 : 0;
  const discount = 0;
  const finalTotal = totalPrice + shippingFee - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fefeff]">
        <Header />
        <section className="bg-[#383838] text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-[120px] font-bold tracking-wider">GIỎ HÀNG</div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl font-bold mb-4">GIỎ HÀNG</h1>
            <div className="text-sm">
              <Link href="/" className="hover:underline">
                TRANG CHỦ
              </Link>
              <span className="mx-2">/</span>
              <span>GIỎ HÀNG</span>
            </div>
          </div>
        </section>
        <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-[#74787c] mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
            <Link href="/shop">
              <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-8">MUA SẮM NGAY</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fefeff]">
      <Header />
      <section className="bg-[#383838] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="text-[120px] font-bold tracking-wider">GIỎ HÀNG</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">GIỎ HÀNG</h1>
          <div className="text-sm">
            <Link href="/" className="hover:underline">
              TRANG CHỦ
            </Link>
            <span className="mx-2">/</span>
            <span>GIỎ HÀNG</span>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="space-y-4 mb-12">
          {items.map((item) => {
            const itemPrice = parseFloat(item.price.replace(/[^\d]/g, ""));
            const customizationPrice = item.customization?.price || 0;
            const totalItemPrice = (itemPrice + customizationPrice) * item.quantity;

            return (
              <div key={`${item.id}-${item.customization?.text || ""}`} className="bg-[#f6f6f7] p-6 rounded-lg flex items-center gap-6 flex-wrap">
                <Link href={`/shop/${item.id}`} className="relative w-24 h-24 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                </Link>
                <div className="flex-1 min-w-[200px]">
                  <Link href={`/shop/${item.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-[#980b15]">{item.name}</h3>
                  </Link>
                  <p className="text-[#74787c]">
                    {item.price}
                    {item.customization && ` + ${formatPrice(customizationPrice)} (Tùy chỉnh)`}
                  </p>
                  <p className="text-[#111111] font-semibold mt-1">Tổng: {formatPrice(totalItemPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                    +
                  </Button>
                </div>
                <Button onClick={() => removeFromCart(item.id)} className="bg-[#980b15] hover:bg-[#7a0808] text-white px-6">
                  <Trash2 className="w-4 h-4 mr-2" />
                  XÓA
                </Button>
              </div>
            );
          })}
        </div>
        <div className="max-w-md ml-auto">
          <div className="bg-[#f6f6f7] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6 border-b-2 border-[#111111] pb-2">TÓM TẮT ĐƠN HÀNG</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tổng tiền hàng:</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Phí vận chuyển:</span>
                <span className="font-medium">{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Giảm giá:</span>
                <span className="font-medium">-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#d9d9d9]">
                <span className="text-lg font-bold">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-[#980b15]">{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <Button onClick={handleCheckout} className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6 text-lg font-semibold">
              TIẾN HÀNH THANH TOÁN
            </Button>
            <Link href="/shop">
              <Button variant="outline" className="w-full mt-3 border-[#111111] text-[#111111] hover:bg-[#ebebeb]">
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
