import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#d9d9d9] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h2 className="text-[#ffffff] text-[120px] font-bold tracking-wider" style={{ WebkitTextStroke: "2px #ffffff" }}>
            DỊCH VỤ CỦA CHÚNG TÔI
          </h2>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-[#ffffff] text-5xl font-bold mb-4">DỊCH VỤ CỦA CHÚNG TÔI</h1>
          <p className="text-[#ffffff] text-sm">TRANG CHỦ / DỊCH VỤ CỦA CHÚNG TÔI</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <button className="bg-[#980b15] text-[#ffffff] px-6 py-2 text-sm font-medium mb-4">HIỆN THỰC HÓA Ý TƯỞNG CỦA BẠN</button>
          <h2 className="text-[#111111] text-4xl font-bold mb-4">DỊCH VỤ</h2>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#980b15]" />
            <div className="w-2 h-2 rounded-full bg-[#980b15]" />
            <div className="w-2 h-2 rounded-full bg-[#980b15]" />
            <div className="w-2 h-2 rounded-full bg-[#980b15]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Embroidery Service Card */}
          <div className="bg-[#ffffff]">
            <div className="relative h-64 mb-6">
              <Image src="/embroidery-machine-with-colorful-threads.jpg" alt="Embroidery Service" fill className="object-cover" />
            </div>
            <h3 className="text-[#111111] text-2xl font-bold mb-6">DỊCH VỤ THÊU</h3>
          </div>

          {/* Printing Service Card */}
          <div className="bg-[#ffffff]">
            <div className="relative h-64 mb-6">
              <Image src="/screen-printing-machine-with-purple-design.jpg" alt="Printing Service" fill className="object-cover" />
            </div>
            <h3 className="text-[#111111] text-2xl font-bold mb-6">DỊCH VỤ IN ẤN</h3>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
