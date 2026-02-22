import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [jsonLd, setJsonLd] = useState<string>("");

  // Generate JSON-LD Schema
  useEffect(() => {
    if (products && products.length > 0) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "เอ็มหัตถ์เทพ - พระเครื่อง",
        description: "ร้านเช่าพระเครื่องพระแท้ ราคามาตรฐาน",
        url: "https://เอ็มหัตถ์เทพ.com",
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.imageUrl,
            price: product.price,
            priceCurrency: "THB",
            availability: product.status === "available" ? "InStock" : "OutOfStock",
            monk: product.monk,
            temple: product.temple,
          },
        })),
      };
      setJsonLd(JSON.stringify(schema));
    }
  }, [products]);

  return (
    <>
      {/* JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">ม</span>
              </div>
              <h1 className="text-2xl font-bold gold-accent">เอ็มหัตถ์เทพ</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#products" className="hover:gold-accent smooth-transition">
                พระเครื่อง
              </a>
              <a href="#about" className="hover:gold-accent smooth-transition">
                เกี่ยวกับเรา
              </a>
              <a href="#contact" className="hover:gold-accent smooth-transition">
                ติดต่อเรา
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="cream-bg py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                เช่าพระเครื่อง
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                พระแท้ ราคามาตรฐาน ที่เอ็มหัตถ์เทพ เรามีพระเครื่องหลากหลายจากพระสงค์ผู้มีคุณวุฒิ
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    window.open("https://line.me/ti/p/@mhathtep", "_blank");
                  }}
                >
                  เช่าบูชาผ่าน Line
                </Button>
                <Button variant="outline" size="lg">
                  ดูเพิ่มเติม
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              พระเครื่องของเรา
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              รวมพระเครื่องจากพระสงค์ผู้มีคุณวุฒิ เช่น หลวงปู่โต๊ะ วัดประดู่ฉิมพลี และอื่นๆ
            </p>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="cream-bg rounded-lg overflow-hidden hover:shadow-lg smooth-transition"
                  >
                    <div className="relative w-full h-64 bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.imageAlt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          ไม่มีรูปภาพ
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {product.description}
                        </p>
                      )}
                      {product.monk && (
                        <p className="text-sm mb-2">
                          <span className="font-semibold">พระสงค์:</span> {product.monk}
                        </p>
                      )}
                      {product.temple && (
                        <p className="text-sm mb-4">
                          <span className="font-semibold">วัด:</span> {product.temple}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold gold-accent">
                          ฿{parseFloat(product.price).toLocaleString("th-TH", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            product.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "available" ? "พร้อมเช่า" : "ไม่พร้อม"}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          window.open(
                            `https://line.me/ti/p/@mhathtep?text=สนใจเช่า ${product.name}`,
                            "_blank"
                          );
                        }}
                      >
                        เช่าบูชา
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">ยังไม่มีพระเครื่องในระบบ</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="cream-bg py-16 md:py-24">
          <div className="container max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">เกี่ยวกับเอ็มหัตถ์เทพ</h2>
            <p className="text-lg text-muted-foreground mb-4">
              เอ็มหัตถ์เทพ เป็นร้านเช่าพระเครื่องที่มีพระแท้ ราคามาตรฐาน
              เรามีพระเครื่องจากพระสงค์ผู้มีคุณวุฒิ เช่น หลวงปู่โต๊ะ วัดประดู่ฉิมพลี
              และพระสงค์อื่นๆ ที่มีชื่อเสียง
            </p>
            <p className="text-lg text-muted-foreground">
              เรามุ่งมั่นในการให้บริการที่ดีที่สุด และมีพระเครื่องที่มีคุณภาพสูง
              เพื่อให้ลูกค้าของเราได้บูชาพระเครื่องที่ดีที่สุด
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">ติดต่อเรา</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Line OA</p>
                <a
                  href="https://line.me/ti/p/@mhathtep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @mhathtep
                </a>
              </div>
              <div>
                <p className="font-semibold mb-2">โดเมน</p>
                <p className="text-muted-foreground">เอ็มหัตถ์เทพ.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-secondary py-8">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">เอ็มหัตถ์เทพ</h3>
                <p className="text-sm text-muted-foreground">
                  ร้านเช่าพระเครื่องพระแท้ ราคามาตรฐาน
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">ลิงก์</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#products" className="text-muted-foreground hover:text-foreground">
                      พระเครื่อง
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-muted-foreground hover:text-foreground">
                      เกี่ยวกับเรา
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-muted-foreground hover:text-foreground">
                      ติดต่อเรา
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">ติดต่อ</h3>
                <a
                  href="https://line.me/ti/p/@mhathtep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Line: @mhathtep
                </a>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 เอ็มหัตถ์เทพ. สงวนลิขสิทธิ์ทั้งหมด</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
