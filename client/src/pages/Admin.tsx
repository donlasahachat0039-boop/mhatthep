import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Edit2, Plus } from "lucide-react";

const ADMIN_PASSWORD = "admin123";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    imageAlt: "",
    status: "available" as const,
    category: "",
    monk: "หลวงปู่โต๊ะ",
    temple: "วัดประดู่ฉิมพลี",
    year: "",
    material: "",
    condition: "",
  });

  // Queries and mutations
  const { data: products = [] } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
      toast.success("เข้าสู่ระบบสำเร็จ");
    } else {
      toast.error("รหัสผ่านไม่ถูกต้อง");
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("อัปเดตพระเครื่องสำเร็จ");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("เพิ่มพระเครื่องสำเร็จ");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        imageAlt: "",
        status: "available",
        category: "",
        monk: "หลวงปู่โต๊ะ",
        temple: "วัดประดู่ฉิมพลี",
        year: "",
        material: "",
        condition: "",
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  // Handle edit
  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      imageAlt: product.imageAlt || "",
      status: product.status,
      category: product.category || "",
      monk: product.monk || "หลวงปู่โต๊ะ",
      temple: product.temple || "วัดประดู่ฉิมพลี",
      year: product.year || "",
      material: product.material || "",
      condition: product.condition || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm("ยืนยันการลบพระเครื่องนี้?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("ลบพระเครื่องสำเร็จ");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gold-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-gold-200">
          <h1 className="text-3xl font-bold text-center mb-2 text-amber-900">
            เอ็มหัตถ์เทพ
          </h1>
          <p className="text-center text-gold-600 mb-8">Admin Panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                รหัสผ่าน
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ใส่รหัสผ่าน"
                className="border-gold-200 focus:border-gold-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gold-600 hover:bg-gold-700 text-white"
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Authenticated - Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gold-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Admin Panel</h1>
            <p className="text-gold-600 mt-1">จัดการพระเครื่อง</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                imageAlt: "",
                status: "available",
                category: "",
                monk: "หลวงปู่โต๊ะ",
                temple: "วัดประดู่ฉิมพลี",
                year: "",
                material: "",
                condition: "",
              });
            }}
            className="bg-gold-600 hover:bg-gold-700 text-white gap-2"
          >
            <Plus size={20} />
            เพิ่มพระเครื่อง
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="p-6 mb-8 border-gold-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              {editingId ? "แก้ไขพระเครื่อง" : "เพิ่มพระเครื่องใหม่"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ชื่อพระเครื่อง */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  ชื่อพระเครื่อง *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="เช่น พระสมเด็จ"
                  className="border-gold-200"
                />
              </div>

              {/* ราคา */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  ราคาเช่า (บาท) *
                </label>
                <Input
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="เช่น 500"
                  className="border-gold-200"
                />
              </div>

              {/* หลวงปู่ */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  หลวงปู่
                </label>
                <Input
                  value={formData.monk}
                  onChange={(e) =>
                    setFormData({ ...formData, monk: e.target.value })
                  }
                  placeholder="หลวงปู่โต๊ะ"
                  className="border-gold-200"
                />
              </div>

              {/* วัด */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  วัด
                </label>
                <Input
                  value={formData.temple}
                  onChange={(e) =>
                    setFormData({ ...formData, temple: e.target.value })
                  }
                  placeholder="วัดประดู่ฉิมพลี"
                  className="border-gold-200"
                />
              </div>

              {/* ปีที่สร้าง */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  ปีที่สร้าง
                </label>
                <Input
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="เช่น 2540"
                  className="border-gold-200"
                />
              </div>

              {/* วัสดุ */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  วัสดุ
                </label>
                <Input
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value })
                  }
                  placeholder="เช่น ทองเหลือง"
                  className="border-gold-200"
                />
              </div>

              {/* สถานะ */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  สถานะ
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gold-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="available">พร้อมเช่า</option>
                  <option value="unavailable">ไม่พร้อมเช่า</option>
                  <option value="sold">ขายแล้ว</option>
                </select>
              </div>

              {/* หมวดหมู่ */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  หมวดหมู่
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="เช่น พระสมเด็จ"
                  className="border-gold-200"
                />
              </div>

              {/* URL รูปภาพ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  URL รูปภาพ
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="border-gold-200"
                />
              </div>

              {/* Alt Text */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Alt Text (สำหรับ SEO)
                </label>
                <Input
                  value={formData.imageAlt}
                  onChange={(e) =>
                    setFormData({ ...formData, imageAlt: e.target.value })
                  }
                  placeholder="พระสมเด็จ - หลวงปู่โต๊ะ - วัดประดู่ฉิมพลี"
                  className="border-gold-200"
                />
              </div>

              {/* คำอธิบาย */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  คำอธิบาย
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="ใส่คำอธิบายเกี่ยวกับพระเครื่อง"
                  className="border-gold-200"
                  rows={3}
                />
              </div>

              {/* สภาพ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  สภาพ
                </label>
                <Input
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  placeholder="เช่น สภาพดี"
                  className="border-gold-200"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มพระเครื่อง"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gold-200"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            รายการพระเครื่อง ({products.length})
          </h2>

          {products.length === 0 ? (
            <Card className="p-8 text-center border-gold-200">
              <p className="text-gold-600">ยังไม่มีพระเครื่อง</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 border-gold-200 hover:shadow-lg transition-shadow"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt || product.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}

                  <h3 className="font-bold text-amber-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gold-600 mb-2">
                    ราคา: {product.price} บาท
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold-200 gap-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 size={16} />
                      แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 gap-1"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={16} />
                      ลบ
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
