"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Select from "react-select";
import provincesData from "@/lib/vietnam-provinces.json";

interface OptionType {
  value: string;
  label: string;
}

interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
}

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, updateQuantity } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const [provinces, setProvinces] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<OptionType | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<OptionType | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    const provinceOptions = provincesData.map((p) => ({
      value: p.codename, // JSON dùng Id
      label: p.name, // JSON dùng Name
    }));
    setProvinces(provinceOptions);
  }, []);

  const totalPrice = getTotalPrice();
  const shippingFee = 30000;
  const discount = 0;
  const finalTotal = totalPrice + shippingFee - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProvinceChange = (option: OptionType | null) => {
    setSelectedProvince(option);
    setSelectedDistrict(null);

    setFormData({
      ...formData,
      province: option ? option.label : "",
      district: "",
    });

    if (option) {
      const selectedProvinceData = provincesData.find((p) => p.codename === option.value);

      const districtOptions =
        selectedProvinceData?.wards.map((d) => ({
          value: d.codename,
          label: d.name,
        })) || [];

      setDistricts(districtOptions);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (option: OptionType | null) => {
    setSelectedDistrict(option);
    setFormData({
      ...formData,
      district: option ? option.label : "",
    });
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (!formData.province || !formData.district) {
      toast.error("Vui lòng chọn Tỉnh/Thành phố và Quận/Huyện!");
      return;
    }

    setIsProcessing(true);

    // Import dynamically để tránh SSR issues
    const { paymentAPI } = await import("@/lib/apiService");

    // Tạo dữ liệu đơn hàng theo đúng format API
    const orderData = {
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: parseFloat(item.price.replace(/[^\d]/g, "")),
        quantity: item.quantity,
        customization: item.customization || null,
      })),
      customerInfo: {
        name: formData.name,
        email: formData.email || "",
        phone: formData.phone,
        province: formData.province,
        district: formData.district,
        address: formData.address,
      },
      note: formData.note || "",
      totalPrice,
      shippingFee,
      discount,
      finalTotal,
    };

    try {
      // Call API để tạo payment link PayOS
      const response = await paymentAPI.create(orderData);

      if (response.success && response.data.paymentUrl) {
        // Lưu orderCode để tracking
        localStorage.setItem("pendingOrderCode", response.data.orderCode.toString());

        // Redirect đến PayOS payment page
        if (typeof window !== "undefined") {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      // Hiển thị lỗi chi tiết từ backend
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => {
          toast.error(err);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
      }

      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fefeff]">
      <Header />

      <section className="bg-[#383838] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="text-[120px] font-bold tracking-wider">THANH TOÁN</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">THANH TOÁN</h1>
          <div className="text-sm">
            <Link href="/" className="hover:underline">
              TRANG CHỦ
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:underline">
              GIỎ HÀNG
            </Link>
            <span className="mx-2">/</span>
            <span>THANH TOÁN</span>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Customer Info Form */}
          <div>
            <h2 className="text-xl font-bold mb-6 border-b-2 border-[#111111] pb-2">THÔNG TIN GIAO HÀNG</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#980b15]">
                  Họ và tên: <span className="text-red-500">*</span>
                </label>
                <Input name="name" value={formData.name} onChange={handleInputChange} className="bg-[#f2f2f2] border-none" placeholder="Nhập họ tên" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại: <span className="text-red-500">*</span>
                </label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="bg-[#f2f2f2] border-none" placeholder="Nhập số điện thoại" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email:</label>
                <Input name="email" value={formData.email} onChange={handleInputChange} type="email" className="bg-[#f2f2f2] border-none" placeholder="Nhập email (tùy chọn)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố:</label>
                  <Select instanceId="province-select" options={provinces} value={selectedProvince} onChange={handleProvinceChange} isSearchable placeholder="Chọn Tỉnh/Thành phố" className="react-select-container" classNamePrefix="react-select" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quận/Huyện:</label>
                  <Select instanceId="district-select" options={districts} value={selectedDistrict} onChange={handleDistrictChange} isSearchable placeholder="Chọn Quận/Huyện" isDisabled={!selectedProvince} className="react-select-container" classNamePrefix="react-select" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ: <span className="text-red-500">*</span>
                </label>
                <Input name="address" value={formData.address} onChange={handleInputChange} className="bg-[#f2f2f2] border-none" placeholder="Số nhà, tên đường..." required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ghi chú:</label>
                <textarea name="note" value={formData.note} onChange={handleInputChange} className="w-full bg-[#f2f2f2] border-none rounded-md p-3 min-h-[100px]" placeholder="Ghi chú về đơn hàng (tùy chọn)" />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <h2 className="text-xl font-bold mb-6 border-b-2 border-[#111111] pb-2">ĐƠN HÀNG CỦA BẠN</h2>

            {/* Order Items */}
            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
              {items.map((item) => {
                const itemPrice = parseFloat(item.price.replace(/[^\d]/g, ""));
                const customizationPrice = item.customization?.price || 0;
                const totalItemPrice = (itemPrice + customizationPrice) * item.quantity;

                const handleQuantityChange = (newQuantity: number) => {
                  if (newQuantity >= 1) {
                    updateQuantity(item.id, newQuantity);
                  }
                };

                return (
                  <div key={`${item.id}-${item.customization?.type || "none"}`} className="flex gap-3 pb-3 border-b border-[#ebebeb]">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-[#74787c] mb-1">{item.price}</p>
                      {item.customization && (
                        <p className="text-xs text-[#980b15]">
                          + {formatPrice(item.customization.price)} ({item.customization.type})
                        </p>
                      )}
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 mt-2">
                        <button onClick={() => handleQuantityChange(item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-[#f2f2f2] rounded text-sm font-medium hover:bg-[#e0e0e0] transition-colors">
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              handleQuantityChange(val);
                            }
                          }}
                          className="w-12 h-6 text-center text-sm border border-[#e0e0e0] rounded focus:outline-none focus:border-[#980b15]"
                        />
                        <button onClick={() => handleQuantityChange(item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-[#f2f2f2] rounded text-sm font-medium hover:bg-[#e0e0e0] transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(totalItemPrice)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="space-y-3 mb-6 bg-[#f6f6f7] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tạm tính:</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Phí vận chuyển:</span>
                <span className="font-medium">{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Giảm giá:</span>
                <span className="font-medium text-[#980b15]">-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-[#111111]">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-2xl font-bold text-[#980b15]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="bg-[#fff3cd] border border-[#ffc107] p-4 rounded-lg mb-6">
              <p className="text-sm text-[#856404]">
                <strong>💳 Phương thức thanh toán:</strong> PayOS
                <br />
                Bạn sẽ được chuyển đến trang thanh toán an toàn của PayOS để hoàn tất giao dịch.
              </p>
            </div>

            {/* Payment Button */}
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-[#980b15] hover:bg-[#7a0808] text-white py-6 text-lg font-semibold">
              {isProcessing ? "ĐANG XỬ LÝ..." : "THANH TOÁN QUA PAYOS"}
            </Button>

            <Link href="/cart">
              <Button variant="outline" className="w-full mt-3 border-[#111111] text-[#111111] hover:bg-[#ebebeb]">
                QUAY LẠI GIỎ HÀNG
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
