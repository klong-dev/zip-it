import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <>
      {/* Top Icon Bar */}
      <div className="bg-[#f6f6f6] pt-2 flex justify-center">
        <img className="max-h-20" src="/chuI.png" alt="chu I" />
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
                HOME
              </Link>
              <Link href="/shop" className="hover:opacity-80 transition-opacity font-medium">
                PRODUCTS
              </Link>
              <Link href="/services" className="hover:opacity-80 transition-opacity font-medium">
                SERVICES
              </Link>
              <Link href="#contact" className="hover:opacity-80 transition-opacity font-medium">
                CONTACT
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span>Hotline: 0945000334</span>
              </div>
              <Link href="/cart" className="hover:opacity-80 transition-opacity">
                <ShoppingCart className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
