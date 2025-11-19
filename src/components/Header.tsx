"use client";

import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Icon Bar */}
      <div className="bg-[#f6f6f6] pt-2 flex justify-center">
        <img className="max-h-20" src="/chuZipDo.png" alt="chu ZIP Do" />
      </div>

      {/* Header Navigation */}
      <header className="bg-[#980b15] text-white relative z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="text-4xl font-bold tracking-wider hover:opacity-80 transition-opacity">
              <img className="max-h-18 pt-2" src="/logo.png" alt="" />
            </Link>

            {/* Navigation - Desktop */}
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
              <Link href="/orders/check" className="hover:opacity-80 transition-opacity font-medium">
                KIỂM TRA ĐƠN HÀNG
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span>Hotline: 0834946906</span>
              </div>
              {/* Hamburger menu icon - only on mobile */}
              <button className="md:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-[#7a0911]/20 transition-colors" aria-label="Mở menu" onClick={() => setMenuOpen((v) => !v)}>
                <Menu className="w-7 h-7" />
              </button>
              <Link href="/cart" className="hover:opacity-80 transition-opacity relative">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-[#980b15] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems > 9 ? "9+" : totalItems}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)}></div>}
        {/* Mobile Menu Drawer */}
        <div className={`fixed top-0 right-0 z-50 w-64 h-full bg-white text-[#111111] shadow-lg transform transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f6f6f6]">
            <span className="font-bold text-lg text-[#980b15]">MENU</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Đóng menu" className="text-[#980b15] text-2xl font-bold">
              ×
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-6 py-6">
            <Link href="/" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              TRANG CHỦ
            </Link>
            <Link href="/shop" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              SẢN PHẨM
            </Link>
            <Link href="/services" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              DỊCH VỤ CỦA CHÚNG TÔI
            </Link>
            <Link href="/contact" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              LIÊN HỆ
            </Link>
            <Link href="/orders/check" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              KIỂM TRA ĐƠN HÀNG
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
