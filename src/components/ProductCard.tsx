import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="aspect-square relative bg-[#f6f6f6]">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 text-center">
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < product.rating ? "fill-[#980b15]" : "fill-[#d9d9d9]"}`} viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <h3 className="font-semibold text-[#111111] mb-2 group-hover:text-[#980b15] transition-colors">{product.name}</h3>
        <p className="text-[#111111] font-medium">{product.price}</p>
      </div>
    </Link>
  );
}
