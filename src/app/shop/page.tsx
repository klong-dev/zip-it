"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect, Suspense } from "react";
import { productsAPI, Product as APIProduct, Category } from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Filter, X } from "lucide-react";

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

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load filter from URL query on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setSelectedCategory(filterParam);
    }
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error("Error loading categories:", err);
    }
  };

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Update URL with filter query
    const params = new URLSearchParams();
    if (category) {
      params.set("filter", category);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
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

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-6 py-12">
        <div className="flex gap-8 max-w-[1920px] mx-auto">
          {/* Sidebar Filter */}
          <aside className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 overflow-hidden flex-shrink-0`}>
            <Card className="p-6 bg-white sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-[#111111] mb-3">DANH MỤC</h4>
                <div className="space-y-2">
                  <button onClick={() => handleCategorySelect("")} className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedCategory === "" ? "bg-[#980b15] text-white" : "hover:bg-[#f6f6f6] text-[#74787c]"}`}>
                    Tất cả sản phẩm
                  </button>
                  {categories.map((category) => (
                    <button key={category.id} onClick={() => handleCategorySelect(category.name)} className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedCategory === category.name ? "bg-[#980b15] text-white" : "hover:bg-[#f6f6f6] text-[#74787c]"}`}>
                      {category.name}
                      <span className="float-right text-xs opacity-70">({category.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filter */}
              {selectedCategory && (
                <Button onClick={() => handleCategorySelect("")} variant="outline" className="w-full border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white">
                  Xóa bộ lọc
                </Button>
              )}
            </Card>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  {sidebarOpen ? "Ẩn" : "Hiện"} bộ lọc
                </Button>

                <div className="flex gap-2 items-center">
                  <span className="text-sm text-[#74787c]">Sắp xếp:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-[#d9d9d9] rounded px-3 py-1.5 text-sm">
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="name_asc">Tên: A-Z</option>
                    <option value="name_desc">Tên: Z-A</option>
                  </select>
                </div>

                {error && <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded">{error}</div>}
              </div>

              {selectedCategory && (
                <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                  <span className="text-sm text-[#74787c]">Đang lọc: </span>
                  <span className="inline-flex items-center gap-2 bg-[#980b15] text-white px-3 py-1 rounded text-sm">
                    {selectedCategory}
                    <button onClick={() => handleCategorySelect("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>
            {/* Products Grid */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
          <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
