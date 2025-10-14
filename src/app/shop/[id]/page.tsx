"use client";

import { useState, use } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const resolvedParams = use(params);

  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#d9d9d9] py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h1 className="text-[#ffffff] text-[120px] font-bold tracking-wider">PRODUCT DETAILS</h1>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-[#ffffff] text-5xl font-bold tracking-wider">PRODUCT DETAILS</h1>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Image src={product.image} alt={product.name} width={500} height={600} className="w-full h-auto rounded-lg" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="text-[#111111] text-3xl font-semibold mb-4">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={i < product.rating ? "#980b15" : "#d9d9d9"} xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0L10.3511 5.52786L16 6.32295L12 10.2721L12.9021 16L8 13.5279L3.09788 16L4 10.2721L0 6.32295L5.64886 5.52786L8 0Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#74787c] text-sm">
                ({product.reviews} customer review{product.reviews > 1 ? "s" : ""})
              </span>
            </div>

            {/* Price */}
            <div className="text-[#111111] text-2xl font-semibold mb-6">{product.priceRange || product.price}</div>

            {/* Description */}
            <p className="text-[#74787c] text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Quantity and Buttons */}
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

              <Button variant="outline" className="px-8 py-2 border-[#111111] text-[#111111] hover:bg-[#ebebeb] bg-transparent">
                CUSTOM
              </Button>

              <Button className="px-8 py-2 bg-[#980b15] text-[#ffffff] hover:bg-[#7a0911]">ADD TO CART</Button>
            </div>

            {/* Product Meta */}
            <div className="text-sm text-[#74787c] space-y-1">
              <p>SKU: {product.sku}</p>
              <p>Category: {product.category}</p>
              <p>Tags: {product.tags.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-[#d9d9d9] bg-transparent rounded-none h-auto p-0">
              <TabsTrigger value="description" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                DESCRIPTION
              </TabsTrigger>
              <TabsTrigger value="additional" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                ADDITIONAL INFORMATION
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-6 py-3 text-[#111111] data-[state=active]:border-b-2 data-[state=active]:border-[#980b15] rounded-none bg-transparent">
                REVIEWS ({product.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8 text-[#74787c] space-y-4">
              <h3 className="text-[#111111] text-xl font-semibold">{product.name}</h3>
              <p className="leading-relaxed">{product.detailedDescription || product.description}</p>
              <p className="leading-relaxed">Crafted from high-quality, eco-friendly materials, this product is durable, washable, and designed to last. The modern and youthful design makes it a trendy accessory for urban lifestyles and on-the-go routines.</p>
              <p className="leading-relaxed">What makes it truly special is the option to personalize: embroider your name, initials, or favorite symbol to create a design that's uniquely yours.</p>
            </TabsContent>

            <TabsContent value="additional" className="mt-8 text-[#74787c]">
              <div className="space-y-2">
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Material:</span>
                  <span>Premium Fabric</span>
                </div>
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Care Instructions:</span>
                  <span>Hand wash or machine wash on gentle cycle</span>
                </div>
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Eco-Friendly:</span>
                  <span>Yes, 100% sustainable materials</span>
                </div>
                <div className="flex border-b border-[#ebebeb] py-2">
                  <span className="w-1/3 font-semibold">Customizable:</span>
                  <span>Yes, embroidery available</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8 text-[#74787c]">
              <div className="space-y-6">
                <div className="border-b border-[#ebebeb] pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 16 16" fill="#980b15">
                          <path d="M8 0L10.3511 5.52786L16 6.32295L12 10.2721L12.9021 16L8 13.5279L3.09788 16L4 10.2721L0 6.32295L5.64886 5.52786L8 0Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold">Great product!</span>
                  </div>
                  <p className="text-sm mb-1">
                    by <strong>Customer</strong> - October 10, 2025
                  </p>
                  <p>Love the quality and design. Perfect for my daily coffee runs!</p>
                </div>

                <div className="text-center py-8">
                  <p className="mb-4">Be the first to review "{product.name}"</p>
                  <Button className="bg-[#980b15] hover:bg-[#7a0911]">Write a Review</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
