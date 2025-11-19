"use client";

import { useState, use, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { productsAPI, Product as APIProduct } from "@/lib/apiService";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<APIProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [resolvedParams.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(parseInt(resolvedParams.id));
      setProduct(response.data);
    } catch (error: any) {
      console.error("Error loading product:", error);

      if (error.message?.includes("Network Error") || error.message?.includes("ECONNREFUSED")) {
        try {
          const { products } = await import("@/lib/products");
          const localProduct = products.find((p) => p.id === parseInt(resolvedParams.id));

          if (localProduct) {
            const apiFormatProduct: APIProduct = {
              id: localProduct.id,
              name: localProduct.name,
              slug: localProduct.name.toLowerCase().replace(/\s+/g, "-"),
              price: parseFloat(localProduct.price.replace(/[^\d]/g, "")),
              priceFormatted: localProduct.price,
              priceRange: localProduct.priceRange,
              image: localProduct.image,
              images: [localProduct.image],
              category: localProduct.category,
              description: localProduct.description,
              detailedDescription: localProduct.detailedDescription || localProduct.description,
              rating: localProduct.rating,
              reviews: localProduct.reviews,
              inStock: true,
              stock: 50,
              sku: localProduct.sku,
              tags: localProduct.tags,
              specifications: {
                material: "Vải canvas cao cấp",
                size: "Kích thước tiêu chuẩn",
                weight: "200g",
                color: "Nhiều màu",
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setProduct(apiFormatProduct);
          } else {
            notFound();
          }
        } catch {
          notFound();
        }
      } else {
        notFound();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.priceFormatted,
      image: product.image,
      category: product.category,
      description: product.description,
      rating: product.rating,
      reviews: product.reviews,
      sku: product.sku,
      tags: product.tags,
    };

    addToCart(cartProduct, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`, {
      action: {
        label: "Xem giỏ hàng",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Header />
      <div className="bg-[#d9d9d9] py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h1 className="text-[#ffffff] text-[120px] font-bold tracking-wider">CHI TIẾT SẢN PHẨM</h1>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-[#ffffff] text-5xl font-bold tracking-wider">CHI TIẾT SẢN PHẨM</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Image src={product.image} alt={product.name} width={500} height={600} className="w-full h-auto rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[#111111] text-3xl font-semibold mb-4">{product.name}</h2>
            {/* <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={i < product.rating ? "#980b15" : "#d9d9d9"}>
                    <path d="M8 0L10.3511 5.52786L16 6.32295L12 10.2721L12.9021 16L8 13.5279L3.09788 16L4 10.2721L0 6.32295L5.64886 5.52786L8 0Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#74787c] text-sm">({product.reviews} đánh giá)</span>
            </div> */}
            <div className="text-[#111111] text-2xl font-semibold mb-6">{product.priceRange || product.priceFormatted}</div>
            <div className="mb-4">{product.inStock ? <span className="text-green-600 font-medium text-sm"> Còn hàng ({product.stock} sản phẩm)</span> : <span className="text-red-600 font-medium text-sm"> Hết hàng</span>}</div>
            <p className="text-[#74787c] text-sm leading-relaxed mb-8">{product.description}</p>
            {product.specifications && (
              <div className="bg-[#f6f6f7] p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3 text-sm">Thông số kỹ thuật:</h3>
                <ul className="space-y-2 text-sm text-[#74787c]">
                  <li>
                    <strong>Chất liệu:</strong> {product.specifications.material}
                  </li>
                  <li>
                    <strong>Kích thước:</strong> {product.specifications.size}
                  </li>
                  <li>
                    <strong>Trọng lượng:</strong> {product.specifications.weight}
                  </li>
                  <li>
                    <strong>Màu sắc:</strong> {product.specifications.color}
                  </li>
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 mb-8 flex-wrap">
              <div className="flex items-center border border-[#111111] rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-[#ebebeb] transition-colors">
                  <Minus size={16} />
                </button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))} className="w-16 text-center border-x border-[#111111] py-2 focus:outline-none" />
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-[#ebebeb] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="px-8 py-2 bg-[#980b15] text-[#ffffff] hover:bg-[#7a0911]">
                {product.inStock ? "THÊM VÀO GIỎ HÀNG" : "HẾT HÀNG"}
              </Button>
            </div>
            <div className="text-sm text-[#74787c] space-y-1">
              <p>Mã SP: {product.sku}</p>
              <p>Danh mục: {product.category}</p>
              <p>Tags: {product.tags.join(", ")}</p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-[#d9d9d9] bg-transparent rounded-none h-auto p-0">
              <TabsTrigger value="description" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                MÔ TẢ
              </TabsTrigger>
              <TabsTrigger value="additional" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                THÔNG TIN BỔ SUNG
              </TabsTrigger>
              {/* <TabsTrigger value="reviews" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                ĐÁNH GIÁ ({product.reviews})
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="description" className="mt-8 text-[#74787c] space-y-4">
              <h3 className="text-[#111111] text-xl font-semibold">{product.name}</h3>
              <p className="leading-relaxed">{product.detailedDescription || product.description}</p>
            </TabsContent>
            <TabsContent value="additional" className="mt-8 text-[#74787c]">
              <div className="space-y-2">
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Chất liệu:</span>
                  <span>Vải cao cấp</span>
                </div>
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Hướng dẫn bảo quản:</span>
                  <span>Giặt tay hoặc giặt máy ở chế độ nhẹ</span>
                </div>
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Thân thiện môi trường:</span>
                  <span>Có, 100% vật liệu bền vững</span>
                </div>
              </div>
            </TabsContent>
            {/* <TabsContent value="reviews" className="mt-8 text-[#74787c]">
              <div className="space-y-6">
                <div className="text-center py-8">
                  <p className="mb-4">Hãy là người đầu tiên đánh giá "{product.name}"</p>
                  <Button className="bg-[#980b15] hover:bg-[#7a0911]">Viết đánh giá</Button>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
