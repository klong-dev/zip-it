"use client";

import { ShoppingCart, Menu, User, LogOut, Package, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { supabase, authHelpers } from "@/lib/supabase";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, setUser, initialize } = useUserStore();

  useEffect(() => {
    // Khởi tạo auth state một lần duy nhất
    initialize();
  }, [initialize]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      setUser(null);
      setUserMenuOpen(false);
      toast.success("Đã đăng xuất");
      router.push("/");
    } catch (error) {
      toast.error("Không thể đăng xuất");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  };

  return (
    <>
      {/* Top Icon Bar */}
      <div className="bg-[#f6f6f6] pt-2 flex justify-center">
        <img className="max-h-20" src="/chuZipDo.png" alt="chu ZIP Do" />
      </div>

      {/* Header Navigation */}
      <header className="bg-[#980b15] text-white relative z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 items-center py-4">
            {/* Logo - Left */}
            <div className="flex justify-start">
              <Link href="/" className="text-4xl font-bold tracking-wider hover:opacity-80 transition-opacity">
                <img className="max-h-18 pt-2" src="/logo.png" alt="" />
              </Link>
            </div>

            {/* Navigation - Center */}
            <nav className="hidden md:flex items-center justify-center gap-8">
              <Link href="/" className="hover:opacity-80 transition-opacity font-medium">
                TRANG CHỦ
              </Link>
              <Link href="/shop" className="hover:opacity-80 transition-opacity font-medium">
                SẢN PHẨM
              </Link>
              <Link href="/services" className="hover:opacity-80 transition-opacity font-medium">
                DỊCH VỤ
              </Link>
              <Link href="/contact" className="hover:opacity-80 transition-opacity font-medium">
                LIÊN HỆ
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center justify-end gap-4">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span>Hotline: 0834946906</span>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium max-w-[120px] truncate">{getUserDisplayName()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800 truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/orders/my-orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Đơn hàng của tôi</span>
                      </Link>
                      <Link href="/addresses" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Sổ địa chỉ</span>
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full transition-colors">
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Đăng nhập</span>
                </Link>
              )}

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

          {/* User info in mobile menu */}
          {user && (
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#980b15]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#980b15]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2 px-6 py-6">
            <Link href="/" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              TRANG CHỦ
            </Link>
            <Link href="/shop" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              SẢN PHẨM
            </Link>
            <Link href="/services" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              DỊCH VỤ
            </Link>
            <Link href="/contact" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium" onClick={() => setMenuOpen(false)}>
              LIÊN HỆ
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link href="/orders/my-orders" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <Package className="w-4 h-4 text-gray-400" />
                  Đơn hàng của tôi
                </Link>
                <Link href="/addresses" className="py-3 px-2 rounded hover:bg-[#f6f6f6] font-medium flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Sổ địa chỉ
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="py-3 px-2 rounded hover:bg-red-50 font-medium flex items-center gap-3 text-red-600 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/login" className="py-3 px-4 bg-[#980b15] text-white rounded-lg font-medium text-center hover:bg-[#7a0912] transition-colors" onClick={() => setMenuOpen(false)}>
                Đăng nhập / Đăng ký
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
