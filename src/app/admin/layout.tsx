import { Home, Package, ShoppingCart, BarChart3, Users, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Sản phẩm
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Đơn hàng
              </Button>
            </Link>
            <Link href="/admin/contacts">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Liên hệ
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
