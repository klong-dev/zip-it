import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fefeff]">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#383838] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="text-[120px] font-bold tracking-wider">CART DETAILS</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">CART</h1>
          <div className="text-sm">
            <a href="#" className="hover:underline">
              HOME
            </a>
            <span className="mx-2">/</span>
            <span>CART</span>
          </div>
        </div>
      </section>

      {/* Cart Items Section */}
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="space-y-4 mb-12">
          {/* Cart Item 1 */}
          <div className="bg-[#f6f6f7] p-6 rounded-lg flex items-center gap-6">
            <Checkbox className="w-5 h-5" />
            <img src="/cup-holder-with-utensils.jpg" alt="Cup Holder" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Cup Holder - Br/Wh</h3>
              <p className="text-[#74787c]">$000.00 - $000.00</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                -
              </Button>
              <span className="w-8 text-center font-medium">1</span>
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                +
              </Button>
            </div>
            <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] px-4">
              Print
            </Button>
            <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-6">DELETE</Button>
          </div>

          {/* Cart Item 2 */}
          <div className="bg-[#f6f6f7] p-6 rounded-lg flex items-center gap-6">
            <Checkbox className="w-5 h-5" />
            <img src="/white-cosmetic-bag.jpg" alt="Cosmetic Bag" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Cosmetic Bag - White</h3>
              <p className="text-[#74787c]">$000.00 - $000.00</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                -
              </Button>
              <span className="w-8 text-center font-medium">1</span>
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                +
              </Button>
            </div>
            <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] px-4">
              Embr
            </Button>
            <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-6">DELETE</Button>
          </div>

          {/* Cart Item 3 */}
          <div className="bg-[#f6f6f7] p-6 rounded-lg flex items-center gap-6">
            <Checkbox className="w-5 h-5" />
            <img src="/black-tote-bag.jpg" alt="Tote Bag" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Tote Bag - Black</h3>
              <p className="text-[#74787c]">$000.00 - $000.00</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                -
              </Button>
              <span className="w-8 text-center font-medium">1</span>
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                +
              </Button>
            </div>
            <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] px-4">
              PreM
            </Button>
            <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-6">DELETE</Button>
          </div>

          {/* Cart Item 4 */}
          <div className="bg-[#f6f6f7] p-6 rounded-lg flex items-center gap-6">
            <Checkbox className="w-5 h-5" />
            <img src="/white-cosmetic-bag-with-zipper.jpg" alt="Cosmetic Bag" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Cosmetic Bag - White</h3>
              <p className="text-[#74787c]">$000.00 - $000.00</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                -
              </Button>
              <span className="w-8 text-center font-medium">1</span>
              <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] h-8 w-8 p-0">
                +
              </Button>
            </div>
            <Button variant="outline" size="sm" className="bg-[#111111] text-white border-none hover:bg-[#000000] px-4">
              PreM
            </Button>
            <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-6">DELETE</Button>
          </div>
        </div>

        {/* Payment Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Payment/Address Form */}
          <div>
            <h2 className="text-xl font-bold mb-6 border-b-2 border-[#111111] pb-2">
              PAYMENT/
              <br />
              ADDRESS
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#980b15]">Receiver:</label>
                <Input className="bg-[#f2f2f2] border-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number:</label>
                <Input className="bg-[#f2f2f2] border-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Provincial / District:</label>
                <Input className="bg-[#f2f2f2] border-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address:</label>
                <Input className="bg-[#f2f2f2] border-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">NOTE:</label>
                <textarea className="w-full bg-[#f2f2f2] border-none rounded-md p-3 min-h-[100px]" placeholder="" />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Voucher:" className="bg-[#f2f2f2] border-none flex-1" />
                <Button className="bg-[#980b15] hover:bg-[#7a0808] text-white px-8">APPLY</Button>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Money:</span>
                  <span className="font-medium">$000.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total shipping fee:</span>
                  <span className="font-medium">$000.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Discount:</span>
                  <span className="font-medium">$000.000</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#d9d9d9]">
                  <span className="text-sm font-semibold">Total Payment:</span>
                  <span className="font-bold">$000.000</span>
                </div>
              </div>

              <Button className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6 text-lg font-semibold mt-6">PAY</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
