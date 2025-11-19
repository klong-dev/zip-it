import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#980b15] text-[#ffffff] py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Get In Touch */}
        <div>
          <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-[#ffffff] inline-block">LIÊN HỆ</h3>
          <div className="space-y-2 text-sm">
            <p>Thu Duc, Ho Chi Minh City</p>
            <p>0834946906</p>
            <p>funizip123@gmail.com</p>
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-[#ffffff] inline-block">KHUNG GIỜ LÀM VIỆC</h3>
          <p className="text-sm">Tất cả các ngày từ 6:00 - 23:00</p>
        </div>

        {/* Social Media */}
        <div>
          <div className="flex gap-4 mb-4">
            <a href="https://www.facebook.com/profile.php?id=61582769884167" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#ffffff] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors">
              <Facebook className="w-5 h-5 text-[#980b15]" />
            </a>
            <a href="https://www.instagram.com/zip.ityourway/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#ffffff] flex items-center justify-center hover:bg-[#f0f0f0] transition-colors">
              <Instagram className="w-5 h-5 text-[#980b15]" />
            </a>
          </div>
          <p className="text-sm">@zip_ityourway</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#ffffff]/30">
        <p className="text-sm">ZIP_ITYOURWAY™</p>
      </div>
    </footer>
  );
}
