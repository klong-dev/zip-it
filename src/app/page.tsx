"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { productsAPI, Product as APIProduct, Category } from "@/lib/apiService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Type converter
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

export default function ZipLandingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 8 });
      const convertedProducts = response.data.products.map(convertAPIProductToLocal);
      setProducts(convertedProducts);
    } catch (error: any) {
      // Fallback to local data if API fails
      if (error.message?.includes("Network Error") || error.message?.includes("ECONNREFUSED")) {
        const { products: localProducts } = await import("@/lib/products");
        setProducts(localProducts.slice(0, 8));
        toast.info("Đang sử dụng dữ liệu mẫu (backend chưa kết nối)");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCategoryClick = (category: string) => {
    // Sử dụng + thay vì %20 cho khoảng trắng
    const encodedCategory = encodeURIComponent(category).replace(/%20/g, "+");
    router.push(`/shop?filter=${encodedCategory}`);
  };
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#bbbbbb] py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 tracking-wide">ZIP IT YOUR WAY</h1>

          <div className="flex justify-center mb-8">
            <img className="max-h-36 pt-2" src="/chuZipDo.png" alt="" />
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-white w-24 md:w-32" />
            <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">PROTECT THE ENVIRONMENT</h2>
            <div className="h-px bg-white w-24 md:w-32" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#980b15] transition-all uppercase text-sm px-6">
              CHI TIẾT SẢN PHẨM
            </Button>
            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#980b15] transition-all uppercase text-sm px-6">
              DỊCH VỤ CỦA CHÚNG TÔI
            </Button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-3">
            <div className="w-4 h-4 rounded-full bg-white" />
            <div className="w-4 h-4 rounded-full bg-white/50" />
            <div className="w-4 h-4 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Illustration */}
            <div className="relative">
              <img src="/illustrated-coffee-cups-with-red-grid-pattern-and-.jpg" alt="Sustainable coffee cups illustration" className="w-full h-auto" />
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-[#111111]">CHÀO MỪNG BẠN ĐẾN VỚI ZIP!</h2>
              <p className="text-[#74787c] leading-relaxed mb-6">Hãy nói lời tạm biệt với nhựa dùng một lần, và thay vào đó là những chiếc túi vải bền đẹp, được thêu riêng mang dấu ấn của chính bạn. Vừa tinh tế, vừa tiện lợi - những lựa chọn thân thiện với môi trường này giúp lối sống xanh trở nên hiện đại, trẻ trung và đầy cảm xúc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#ececec]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#980b15] text-white text-xs uppercase px-3 py-1 mb-4">DỊCH VỤ CỦA CHÚNG TÔI</div>
            <h2 className="text-4xl font-bold text-[#111111]">GIỚI THIỆU VỀ DỊCH VỤ CỦA ZIP</h2>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-[#980b15]" />
              <div className="w-2 h-2 rounded-full bg-[#980b15]" />
              <div className="w-2 h-2 rounded-full bg-[#980b15]" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Embroidery Service */}
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img src="/embroidery-machine-working-on-fabric-with-colorful.jpg" alt="Embroidery service" className="w-full h-48 object-cover rounded" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">DỊCH VỤ THÊU</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Gửi trao yêu thương qua từng đường kim mũi chỉ — nhỏ bé cùng chúng tôi, nhưng chứa đựng ý nghĩa sâu sắc và được tạo nên để bền lâu.</p>
            </Card>

            {/* Printing Service */}
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img src="/screen-printing-process-on-fabric-with-purple-desi.jpg" alt="Printing service" className="w-full h-48 object-cover rounded" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">DỊCH VỤ IN ẤN</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Thiết kế của chúng tôi là sắc xanh của sự sống — nơi những ý tưởng của bạn được thổi hồn và trở thành hiện thực.</p>
            </Card>

            {/* Design Services */}
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex items-center justify-center h-48 bg-white">
                <img src="/chuZipDo.png" alt="" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">DỊCH VỤ THIẾT KẾ</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Chúng tôi thiết kế những trải nghiệm đầy ý nghĩa — phản chiếu giá trị của bạn, kể lại câu chuyện của riêng bạn, và giúp bạn tạo nên sự khác biệt thật sự.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12">
            <div className="inline-block bg-[#980b15] text-white text-xs font-semibold uppercase px-4 py-1.5 mb-4">SẢN PHẨM</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-8">GIỚI THIỆU VỀ SẢN PHẨM CỦA ZIP</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="outline" className="border-2 border-[#980b15] bg-[#980b15] text-white hover:bg-[#7a0911] hover:border-[#7a0911] uppercase text-xs font-semibold px-6 py-2.5 rounded-none transition-all">
                  TẤT CẢ
                </Button>
              </Link>
              {categories.map((category) => (
                <Button key={category.id} onClick={() => handleCategoryClick(category.name)} variant="outline" className="border border-[#d9d9d9] text-[#74787c] hover:bg-[#f5f5f5] hover:border-[#980b15] uppercase text-xs font-medium px-6 py-2.5 bg-transparent rounded-none transition-all">
                  {category.name.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Grid - Display first 8 products */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#f6f6f6] rounded-lg overflow-hidden">
                  <div className="aspect-square bg-[#e0e0e0] animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[#e0e0e0] rounded animate-pulse" />
                    <div className="h-4 bg-[#e0e0e0] rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="flex justify-center">
            <Link href="/shop">
              <Button className="bg-[#980b15] hover:bg-[#7a0911] text-white uppercase font-semibold px-10 py-6 text-sm rounded-none shadow-lg hover:shadow-xl transition-all">XEM TẤT CẢ SẢN PHẨM →</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
