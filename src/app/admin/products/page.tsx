"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash2, AlertCircle, Home, ShoppingCart, BarChart3 } from "lucide-react";
import Link from "next/link";
import { adminAPI, AdminProduct } from "@/lib/apiService";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    detailedDescription: "",
    tags: "",
    rating: "4",
    reviews: "0",
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.products.getAll({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
      });
      setProducts(response.data.products);
    } catch (error: any) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleCreateProduct = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("detailedDescription", formData.detailedDescription);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("reviews", formData.reviews);

      // Add images
      if (imageFiles && imageFiles.length > 0) {
        Array.from(imageFiles).forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      await adminAPI.products.create(formDataToSend);
      toast.success("Tạo sản phẩm thành công!");
      setIsCreateDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tạo sản phẩm");
      console.error(error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await adminAPI.products.update(editingProduct.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        inStock: parseInt(formData.stock) > 0,
        description: formData.description,
        detailedDescription: formData.detailedDescription,
        category: formData.category,
        tags: formData.tags,
      });
      toast.success("Cập nhật sản phẩm thành công!");
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể cập nhật sản phẩm");
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await adminAPI.products.delete(id);
      toast.success("Xóa sản phẩm thành công!");
      loadProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xóa sản phẩm");
      console.error(error);
    }
  };

  const openEditDialog = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      description: product.description,
      detailedDescription: product.detailedDescription,
      tags: product.tags.join(", "),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      detailedDescription: "",
      tags: "",
      rating: "4",
      reviews: "0",
    });
    setImageFiles(null);
  };

  const categories = ["Túi Tote", "Balo", "Túi Xách", "Phụ Kiện"];

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#980b15]" />
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">Quản lý Sản phẩm</h1>
                <p className="text-sm text-[#74787c]">Thêm, sửa, xóa sản phẩm</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Đơn hàng
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#74787c]" />
              <Input placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} className="pl-10" />
            </div>
            <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
              <Search className="w-4 h-4 mr-2" />
              Tìm
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-[#74787c] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#111111] mb-2">Không có sản phẩm</h3>
            <p className="text-[#74787c]">Chưa có sản phẩm nào trong hệ thống.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f6f6f7]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Hình ảnh</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Tên sản phẩm</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Danh mục</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Giá</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Tồn kho</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#111111]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebebeb]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#f6f6f7] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-[#f6f6f7]">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#111111]">{product.name}</div>
                        <div className="text-sm text-[#74787c] line-clamp-1">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#74787c]">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#980b15]">{product.priceFormatted}</td>
                      <td className="px-6 py-4 text-sm text-[#111111]">{product.stock}</td>
                      <td className="px-6 py-4">{product.inStock ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Còn hàng</span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Hết hàng</span>}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>Điền thông tin để tạo sản phẩm mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Giá *</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Tồn kho *</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả ngắn</Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="detailedDescription">Mô tả chi tiết</Label>
              <Textarea id="detailedDescription" value={formData.detailedDescription} onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} rows={4} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
              <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="canvas, tote, fashion" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">Hình ảnh (tối đa 5 ảnh)</Label>
              <Input id="images" type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateProduct} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
              Tạo sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Tên sản phẩm *</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Giá *</Label>
                <Input id="edit-price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Tồn kho *</Label>
                <Input id="edit-stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Danh mục *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Mô tả ngắn</Label>
              <Input id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-detailedDescription">Mô tả chi tiết</Label>
              <Textarea id="edit-detailedDescription" value={formData.detailedDescription} onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} rows={4} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (phân cách bằng dấu phẩy)</Label>
              <Input id="edit-tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="canvas, tote, fashion" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditProduct} className="bg-[#980b15] hover:bg-[#7a0911] text-white">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
