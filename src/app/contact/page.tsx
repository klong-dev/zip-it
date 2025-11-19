"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { contactAPI } from "@/lib/apiService";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);

    try {
      await contactAPI.create(formData);
      toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#999999] py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <h2 className="text-[200px] font-bold text-white tracking-wider" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
            LIÊN HỆ
          </h2>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h1>
          <p className="text-white text-sm">
            <span className="hover:underline cursor-pointer">TRANG CHỦ</span> / <span className="font-semibold">LIÊN HỆ</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[#111111] mb-6">THÔNG TIN LIÊN HỆ</h2>
              <p className="text-[#74787c] mb-8">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:</p>

              <div className="space-y-6">
                {/* Address */}
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#980b15]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111111] mb-2">Địa chỉ</h3>
                      <p className="text-[#74787c]">Thu Duc, Ho Chi Minh City</p>
                    </div>
                  </div>
                </Card>

                {/* Phone */}
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#980b15]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111111] mb-2">Số điện thoại</h3>
                      <a href="tel:0834946906" className="text-[#980b15] hover:underline">
                        0834946906
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Email */}
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#980b15]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111111] mb-2">Email</h3>
                      <a href="mailto:funizip123@gmail.com" className="text-[#980b15] hover:underline">
                        funizip123@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Social Media */}
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-[#111111] mb-4">Kết nối với chúng tôi</h3>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/profile.php?id=61582769884167" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#980b15] flex items-center justify-center hover:bg-[#7a0911] transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a href="https://www.instagram.com/zip.ityourway/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#980b15] flex items-center justify-center hover:bg-[#7a0911] transition-colors">
                      <Instagram className="w-6 h-6 text-white" />
                    </a>
                  </div>
                  <div className="mt-4 space-y-2">
                    <a href="https://www.facebook.com/profile.php?id=61582769884167" target="_blank" rel="noopener noreferrer" className="block text-[#74787c] hover:text-[#980b15] text-sm">
                      Facebook: ZIP IT YOUR WAY
                    </a>
                    <a href="https://www.instagram.com/zip.ityourway/" target="_blank" rel="noopener noreferrer" className="block text-[#74787c] hover:text-[#980b15] text-sm">
                      Instagram: @zip_ityourway
                    </a>
                  </div>
                </Card>

                {/* Working Hours */}
                <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-[#111111] mb-2">Giờ làm việc</h3>
                  <p className="text-[#74787c]">Tất cả các ngày từ 6:00 - 23:00</p>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8 bg-white shadow-lg">
                <h2 className="text-3xl font-bold text-[#111111] mb-2">GỬI THÔNG TIN LIÊN HỆ</h2>
                <p className="text-[#74787c] mb-8">Để lại thông tin liên hệ cho chúng tôi, chúng tôi sẽ phản hồi sớm nhất có thể.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#111111] mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Nhập họ và tên của bạn" required className="border-[#d9d9d9] focus:border-[#980b15]" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Nhập địa chỉ email của bạn" required className="border-[#d9d9d9] focus:border-[#980b15]" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#111111] mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại của bạn" required className="border-[#d9d9d9] focus:border-[#980b15]" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#111111] mb-2">
                      Nội dung
                    </label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Nhập nội dung bạn muốn gửi..." rows={6} className="border-[#d9d9d9] focus:border-[#980b15] resize-none" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#980b15] hover:bg-[#7a0911] text-white font-semibold py-6 text-base">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      "GỬI THÔNG TIN"
                    )}
                  </Button>
                </form>
              </Card>

              {/* Additional Info */}
              <div className="mt-8 bg-[#980b15] text-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">CAM KẾT CỦA CHÚNG TÔI</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Phản hồi trong vòng 24 giờ</li>
                  <li>• Tư vấn miễn phí về sản phẩm và dịch vụ</li>
                  <li>• Hỗ trợ thiết kế theo yêu cầu</li>
                  <li>• Đảm bảo chất lượng sản phẩm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
