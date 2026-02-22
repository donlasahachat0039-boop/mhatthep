import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword] = useState("admin123"); // ควรใช้ environment variable

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center gold-accent">
              Admin Panel
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณาใส่รหัสผ่าน"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <Button onClick={handleLogin} className="w-full bg-primary">
                เข้าสู่ระบบ
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard />
  );
}

function AdminDashboard() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    imageAlt: "",
    status: "available" as const,
    category: "",
    monk: "",
    temple: "",
    year: "",
    material: "",
    condition: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add/edit product logic
    console.log("Submit form:", formData);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      imageAlt: "",
      status: "available",
      category: "",
      monk: "",
      temple: "",
      year: "",
      material: "",
      condition: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gold-accent">Admin Panel</h1>
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Implement logout
            }}
          >
            ออกจากระบบ
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Add Product Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">จัดการพระเครื่อง</h2>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary"
          >
            {showForm ? "ยกเลิก" : "เพิ่มพระเครื่องใหม่"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-card rounded-lg p-8 mb-8 border border-border">
            <h3 className="text-2xl font-bold mb-6">
              {editingId ? "แก้ไขพระเครื่อง" : "เพิ่มพระเครื่องใหม่"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อพระเครื่อง *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="เช่น พระสมเด็จ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ราคา (บาท) *</label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="เช่น 5000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">คำอธิบาย</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="คำอธิบายเกี่ยวกับพระเครื่อง"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">URL รูปภาพ</label>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alt Text รูปภาพ</label>
                  <Input
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleInputChange}
                    placeholder="คำอธิบายรูปภาพ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">พระสงค์</label>
                  <Input
                    name="monk"
                    value={formData.monk}
                    onChange={handleInputChange}
                    placeholder="เช่น หลวงปู่โต๊ะ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">วัด</label>
                  <Input
                    name="temple"
                    value={formData.temple}
                    onChange={handleInputChange}
                    placeholder="เช่น วัดประดู่ฉิมพลี"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ปีที่สร้าง</label>
                  <Input
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="เช่น 2540"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">วัสดุ</label>
                  <Input
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="เช่น ทองแดง"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">สถานะ</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="available">พร้อมเช่า</option>
                    <option value="unavailable">ไม่พร้อม</option>
                    <option value="sold">ขายแล้ว</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary">
                  {editingId ? "อัปเดต" : "เพิ่ม"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div>
          <h3 className="text-2xl font-bold mb-6">รายการพระเครื่อง</h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">ชื่อ</th>
                    <th className="text-left py-3 px-4 font-semibold">ราคา</th>
                    <th className="text-left py-3 px-4 font-semibold">พระสงค์</th>
                    <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                    <th className="text-left py-3 px-4 font-semibold">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">฿{parseFloat(product.price).toLocaleString()}</td>
                      <td className="py-3 px-4">{product.monk || "-"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            product.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "available" ? "พร้อมเช่า" : "ไม่พร้อม"}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(product.id);
                            setShowForm(true);
                            // TODO: Load product data into form
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            // TODO: Implement delete logic
                            if (confirm("คุณแน่ใจหรือว่าต้องการลบ?")) {
                              console.log("Delete product:", product.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ยังไม่มีพระเครื่องในระบบ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
