"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, ArrowLeft, Home, Building, Phone, User, X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/stores/user-store";
import { userAPI } from "@/lib/apiService";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

// Dynamic import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

interface Address {
  id: number;
  full_name: string;
  phone: string;
  address: string;
  province: string;
  province_code: string;
  district: string;
  district_code: string;
  ward?: string;
  ward_code?: string;
  is_default: boolean;
  type: "home" | "office" | "other";
}

interface VNWard {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
}

interface VNProvince {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
  wards: VNWard[];
}

interface SelectOption {
  value: string;
  label: string;
  code: string;
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading: userLoading, fetchUser } = useUserStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    province: "",
    province_code: "",
    district: "",
    district_code: "",
    ward: "",
    ward_code: "",
    is_default: false,
    type: "home" as "home" | "office" | "other",
  });

  // Location data - using simple format matching vietnam-provinces.json
  // Note: The JSON file has provinces with wards (acting as districts)
  const [vnProvinces, setVnProvinces] = useState<VNProvince[]>([]);
  const [currentDistricts, setCurrentDistricts] = useState<SelectOption[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Chỉ check auth một lần
    if (authChecked) return;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        sessionStorage.setItem("redirectAfterLogin", "/addresses");
        router.push("/login");
        return;
      }
      setAuthChecked(true);
      loadAddresses();
      loadProvinces();
    };
    checkAuth();
  }, [router, authChecked]);

  const loadProvinces = async () => {
    try {
      const response = await import("@/lib/vietnam-provinces.json");
      setVnProvinces(response.default || []);
    } catch (error) {
      console.error("Error loading provinces:", error);
    }
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAddresses();
      if (response.data?.addresses) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      // Mock data for demo if API not available
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (selected: SelectOption | null) => {
    if (selected) {
      const province = vnProvinces.find((p) => p.codename === selected.value);
      setFormData((prev) => ({
        ...prev,
        province: selected.label,
        province_code: selected.value,
        district: "",
        district_code: "",
        ward: "",
        ward_code: "",
      }));
      // Use wards as districts (JSON structure)
      const districtOptions: SelectOption[] =
        province?.wards?.map((w) => ({
          value: w.codename,
          label: w.name,
          code: String(w.code),
        })) || [];
      setCurrentDistricts(districtOptions);
    }
  };

  const handleDistrictChange = (selected: SelectOption | null) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        district: selected.label,
        district_code: selected.value,
        ward: "",
        ward_code: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      address: "",
      province: "",
      province_code: "",
      district: "",
      district_code: "",
      ward: "",
      ward_code: "",
      is_default: false,
      type: "home",
    });
    setCurrentDistricts([]);
    setEditingAddress(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address: address.address,
      province: address.province,
      province_code: address.province_code,
      district: address.district,
      district_code: address.district_code,
      ward: address.ward || "",
      ward_code: address.ward_code || "",
      is_default: address.is_default,
      type: address.type,
    });

    // Load districts for the selected province
    const province = vnProvinces.find((p) => p.codename === address.province_code);
    if (province) {
      const districtOptions: SelectOption[] =
        province.wards?.map((w) => ({
          value: w.codename,
          label: w.name,
          code: String(w.code),
        })) || [];
      setCurrentDistricts(districtOptions);
    }

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone || !formData.address || !formData.province || !formData.district) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      if (editingAddress) {
        await userAPI.updateAddress(editingAddress.id, formData);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await userAPI.addAddress(formData);
        toast.success("Thêm địa chỉ thành công");
      }
      setShowForm(false);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(editingAddress ? "Không thể cập nhật địa chỉ" : "Không thể thêm địa chỉ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    setDeletingId(id);
    try {
      await userAPI.deleteAddress(id);
      toast.success("Đã xóa địa chỉ");
      loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Không thể xóa địa chỉ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userAPI.setDefaultAddress(id);
      toast.success("Đã đặt làm địa chỉ mặc định");
      loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Không thể đặt làm địa chỉ mặc định");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "office":
        return <Building className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "home":
        return "Nhà riêng";
      case "office":
        return "Văn phòng";
      default:
        return "Khác";
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#980b15]" />
      </div>
    );
  }

  const provinceOptions: SelectOption[] = vnProvinces.map((p) => ({
    value: p.codename,
    label: p.name,
    code: String(p.code),
  }));

  // currentDistricts is already in SelectOption format

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f6f6f6]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-[#980b15] hover:text-[#7a0912] mb-2 text-sm">
                <ArrowLeft className="w-4 h-4" />
                Quay lại trang chủ
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-[#980b15]" />
                Sổ địa chỉ
              </h1>
            </div>
            <button onClick={openAddForm} className="flex items-center gap-2 px-4 py-2 bg-[#980b15] text-white rounded-lg hover:bg-[#7a0912] transition-colors">
              <Plus className="w-4 h-4" />
              Thêm địa chỉ
            </button>
          </div>

          {/* Address List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#980b15]" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-gray-500 mb-6">Thêm địa chỉ giao hàng để mua sắm nhanh hơn</p>
              <button onClick={openAddForm} className="inline-flex items-center gap-2 px-6 py-3 bg-[#980b15] text-white rounded-lg hover:bg-[#7a0912] transition-colors">
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div key={address.id} className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-colors ${address.is_default ? "border-[#980b15]" : "border-transparent"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${address.type === "home" ? "bg-blue-100 text-blue-700" : address.type === "office" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                        {getTypeIcon(address.type)}
                        {getTypeLabel(address.type)}
                      </span>
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-[#980b15]/10 text-[#980b15]">
                          <Star className="w-3 h-3 fill-current" />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditForm(address)} className="p-2 text-gray-400 hover:text-[#980b15] hover:bg-gray-100 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(address.id)} disabled={deletingId === address.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Xóa">
                        {deletingId === address.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-800">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{address.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p>{address.address}</p>
                        <p>
                          {address.ward && `${address.ward}, `}
                          {address.district}, {address.province}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!address.is_default && (
                    <button onClick={() => handleSetDefault(address.id)} className="mt-4 text-sm text-[#980b15] hover:text-[#7a0912] font-medium">
                      Đặt làm địa chỉ mặc định
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Address Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại địa chỉ</label>
                  <div className="flex gap-3">
                    {[
                      { value: "home", label: "Nhà riêng", icon: Home },
                      { value: "office", label: "Văn phòng", icon: Building },
                      { value: "other", label: "Khác", icon: MapPin },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, type: value as "home" | "office" | "other" }))}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${formData.type === value ? "border-[#980b15] bg-[#980b15]/5 text-[#980b15]" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.full_name} onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))} required placeholder="Nguyễn Văn A" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required placeholder="0912345678" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none" />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <Select options={provinceOptions} value={provinceOptions.find((p) => p.value === formData.province_code) || null} onChange={(selected) => handleProvinceChange(selected as SelectOption | null)} placeholder="Chọn tỉnh/thành phố" isClearable className="react-select-container" classNamePrefix="react-select" />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <Select options={currentDistricts} value={currentDistricts.find((d) => d.value === formData.district_code) || null} onChange={(selected) => handleDistrictChange(selected as SelectOption | null)} placeholder="Chọn quận/huyện" isClearable isDisabled={!formData.province_code} className="react-select-container" classNamePrefix="react-select" />
                </div>

                {/* Address Detail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} required placeholder="Số nhà, tên đường, tòa nhà..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#980b15] focus:border-transparent outline-none" />
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, is_default: !prev.is_default }))} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.is_default ? "bg-[#980b15] border-[#980b15]" : "border-gray-300 hover:border-gray-400"}`}>
                    {formData.is_default && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <label className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-3 bg-[#980b15] text-white rounded-lg hover:bg-[#7a0912] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
