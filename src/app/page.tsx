import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ZipLandingPage() {
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
              VIEW PRODUCT
            </Button>
            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#980b15] transition-all uppercase text-sm px-6">
              VIEW SERVICES
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
              <h2 className="text-4xl font-bold mb-6 text-[#111111]">WELCOME TO ZIP</h2>
              <p className="text-[#74787c] leading-relaxed mb-6">Stylish sustainable living — replace single-use plastics with durable, personalized fabric carriers that reflect your unique style. With aesthetic and practical design, these eco-friendly choices make green living modern, youthful, and accessible.</p>
              <Button className="bg-[#980b15] hover:bg-[#2c0606] text-white uppercase text-sm px-6">ZIP IT YOUR WAY</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#ececec]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#980b15] text-white text-xs uppercase px-3 py-1 mb-4">OUR SERVICES</div>
            <h2 className="text-4xl font-bold text-[#111111]">OUR BRAND SERVICE</h2>
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
              <h3 className="text-xl font-bold mb-3 text-[#111111]">EMBROIDERY SERVICE</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Share your love through every stitch — small with us, deeply meaningful, tailored to last.</p>
              <Button variant="outline" className="border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white uppercase text-xs bg-transparent">
                READ MORE →
              </Button>
            </Card>

            {/* Printing Service */}
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img src="/screen-printing-process-on-fabric-with-purple-desi.jpg" alt="Printing service" className="w-full h-48 object-cover rounded" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">PRINTING SERVICE</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Our designs are green—bringing your ideas to life.</p>
              <Button variant="outline" className="border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white uppercase text-xs bg-transparent">
                READ MORE →
              </Button>
            </Card>

            {/* Design Services */}
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex items-center justify-center h-48 bg-white">
                <img src="/chuZipDo.png" alt="" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#111111]">DESIGN SERVICES</h3>
              <p className="text-[#74787c] text-sm mb-4 leading-relaxed">Why don't you create exactly — we design meaningful experiences that reflect your values, tell your story, and help you make a real difference.</p>
              <Button variant="outline" className="border-[#980b15] text-[#980b15] hover:bg-[#980b15] hover:text-white uppercase text-xs bg-transparent">
                READ MORE →
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12">
            <div className="inline-block bg-[#980b15] text-white text-xs font-semibold uppercase px-4 py-1.5 mb-4">PRODUCTS</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-8">PRODUCTS FROM US</h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-2 border-[#980b15] bg-[#980b15] text-white hover:bg-[#7a0911] hover:border-[#7a0911] uppercase text-xs font-semibold px-6 py-2.5 rounded-none transition-all">
                ALL
              </Button>
              <Button variant="outline" className="border border-[#d9d9d9] text-[#74787c] hover:bg-[#f5f5f5] hover:border-[#980b15] uppercase text-xs font-medium px-6 py-2.5 bg-transparent rounded-none transition-all">
                CUP HOLDER
              </Button>
              <Button variant="outline" className="border border-[#d9d9d9] text-[#74787c] hover:bg-[#f5f5f5] hover:border-[#980b15] uppercase text-xs font-medium px-6 py-2.5 bg-transparent rounded-none transition-all">
                CANVAS TOTE
              </Button>
              <Button variant="outline" className="border border-[#d9d9d9] text-[#74787c] hover:bg-[#f5f5f5] hover:border-[#980b15] uppercase text-xs font-medium px-6 py-2.5 bg-transparent rounded-none transition-all">
                COSMETIC BAG
              </Button>
              <Button variant="outline" className="border border-[#d9d9d9] text-[#74787c] hover:bg-[#f5f5f5] hover:border-[#980b15] uppercase text-xs font-medium px-6 py-2.5 bg-transparent rounded-none transition-all">
                PEN CASE
              </Button>
            </div>
          </div>

          {/* Product Grid - Display first 8 products */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <Link href="/shop">
              <Button className="bg-[#980b15] hover:bg-[#7a0911] text-white uppercase font-semibold px-10 py-6 text-sm rounded-none shadow-lg hover:shadow-xl transition-all">VIEW ALL PRODUCTS →</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
