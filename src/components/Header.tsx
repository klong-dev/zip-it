"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      {/* Top Icon Bar */}
      <div className="bg-[#f6f6f6] pt-2 flex justify-center">
        <img className="max-h-20" src="/chuZipDo.png" alt="chu ZIP Do" />
      </div>

      {/* Header Navigation */}
      <header className="bg-[#980b15] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="text-4xl font-bold tracking-wider hover:opacity-80 transition-opacity">
              <img className="max-h-18 pt-2" src="/logo.png" alt="" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="hover:opacity-80 transition-opacity font-medium">
                TRANG CHỦ
              </Link>
              <Link href="/shop" className="hover:opacity-80 transition-opacity font-medium">
                SẢN PHẨM
              </Link>
              <Link href="/services" className="hover:opacity-80 transition-opacity font-medium">
                DỊCH VỤ CỦA CHÚNG TÔI
              </Link>
              <Link href="/contact" className="hover:opacity-80 transition-opacity font-medium">
                LIÊN HỆ
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span>Hotline: 0834946906</span>
              </div>
              <Link href="/cart" className="hover:opacity-80 transition-opacity relative">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-[#980b15] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems > 9 ? "9+" : totalItems}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
