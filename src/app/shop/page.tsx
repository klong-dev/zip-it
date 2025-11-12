"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { productsAPI, Product as APIProduct } from "@/lib/apiService";
import { Button } from "@/components/ui/button";

// Type converter để tương thích với ProductCard hiện tại
interface LocalProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  sku: string;
  tags: string[];
}

const convertAPIProductToLocal = (apiProduct: APIProduct): LocalProduct => ({
  id: apiProduct.id,
  name: apiProduct.name,
  price: apiProduct.priceFormatted,
  image: apiProduct.image,
  category: apiProduct.category,
  description: apiProduct.description,
  rating: apiProduct.rating,
  reviews: apiProduct.reviews,
  sku: apiProduct.sku,
  tags: apiProduct.tags,
});

export default function ShopPage() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.getAll({
        page: currentPage,
        limit: 12,
        category: selectedCategory || undefined,
        sort: sortBy as any,
      });

      const localProducts = response.data.products.map(convertAPIProductToLocal);
      setProducts(localProducts);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      console.error("Error loading products:", err);

      // Nếu API fail, fallback về products từ file
      if (err.message?.includes("Network Error") || err.message?.includes("ECONNREFUSED")) {
        try {
          const { products: fallbackProducts } = await import("@/lib/products");
          setProducts(fallbackProducts);
          setError("⚠️ Đang sử dụng dữ liệu mẫu. Backend API chưa khả dụng.");
        } catch {
          setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        }
      } else {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#999999] py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h2 className="text-[200px] font-bold text-white tracking-wider" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            CỬA HÀNG
          </h2>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">SẢN PHẨM</h1>
          <p className="text-white text-sm">
            <span className="hover:underline cursor-pointer">TRANG CHỦ</span> / <span className="hover:underline cursor-pointer">SẢN PHẨM</span> / TẤT CẢ
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#e0e0e0] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-[#74787c]">Sắp xếp:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-[#d9d9d9] rounded px-3 py-1 text-sm">
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="name_asc">Tên: A-Z</option>
              <option value="name_desc">Tên: Z-A</option>
            </select>
          </div>

          {error && <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">{error}</div>}
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#74787c] text-lg">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline" className="border-[#111111]">
                  Trang trước
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} onClick={() => setCurrentPage(page)} variant={currentPage === page ? "default" : "outline"} className={currentPage === page ? "bg-[#980b15] text-white" : "border-[#111111]"}>
                      {page}
                    </Button>
                  ))}
                </div>
                <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline" className="border-[#111111]">
                  Trang sau
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
