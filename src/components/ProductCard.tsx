"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <Link href={`/shop/${product.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="aspect-square relative bg-[#f6f6f6] overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />

        {/* Add to Cart Button - appears on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <Button onClick={handleAddToCart} className="bg-[#980b15] hover:bg-[#7a0911] text-white font-semibold px-6 py-5 rounded-none shadow-lg transform transition-all duration-300 hover:scale-105">
            <ShoppingCart className="w-5 h-5 mr-2" />
            THÊM VÀO GIỎ
          </Button>
        </div>
      </div>

      <div className="p-4 text-center">
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < product.rating ? "fill-[#980b15]" : "fill-[#d9d9d9]"}`} viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <h3 className="font-semibold text-[#111111] mb-2 group-hover:text-[#980b15] transition-colors line-clamp-2 min-h-[3rem]">{product.name}</h3>
        <p className="text-[#980b15] font-bold text-lg">{product.price}</p>
      </div>
    </Link>
  );
}
