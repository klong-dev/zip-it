import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#999999] py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h2 className="text-[200px] font-bold text-white tracking-wider" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            OUR SHOP
          </h2>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">SHOP</h1>
          <p className="text-white text-sm">
            <span className="hover:underline cursor-pointer">HOME</span> / <span className="hover:underline cursor-pointer">SHOP</span> / ALL
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
