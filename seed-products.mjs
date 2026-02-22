import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3] || 'mhatthep_db',
});

const products = [
  {
    name: 'พระปิดตา หลวงปู่โต๊ะ',
    description: 'พระปิดตาจัมโบ้ หลวงปู่โต๊ะ วัดประดู่ฉิมพลี รุ่นแรก ปี 2540 สภาพสวยงาม',
    price: '1500',
    imageUrl: '/images/luang-pu-to-amulet-1.jpg',
    imageAlt: 'พระปิดตา หลวงปู่โต๊ะ วัดประดู่ฉิมพลี',
    status: 'available',
    category: 'พระปิดตา',
    monk: 'หลวงปู่โต๊ะ',
    temple: 'วัดประดู่ฉิมพลี',
    year: '2540',
    material: 'ทองเหลือง',
    condition: 'สภาพดี',
  },
  {
    name: 'พระสมเด็จ หลวงปู่โต๊ะ',
    description: 'พระสมเด็จ หลวงปู่โต๊ะ วัดประดู่ฉิมพลี รุ่นสำคัญ ปี 2545 พิมพ์ใหญ่',
    price: '2000',
    imageUrl: '/images/luang-pu-to-2.jpg',
    imageAlt: 'พระสมเด็จ หลวงปู่โต๊ะ วัดประดู่ฉิมพลี',
    status: 'available',
    category: 'พระสมเด็จ',
    monk: 'หลวงปู่โต๊ะ',
    temple: 'วัดประดู่ฉิมพลี',
    year: '2545',
    material: 'ทองเหลือง',
    condition: 'สภาพดี',
  },
  {
    name: 'พระเสมา หลวงปู่โต๊ะ',
    description: 'พระเสมา หลวงปู่โต๊ะ วัดประดู่ฉิมพลี รุ่นเสาร์ห้า ปี 2548',
    price: '1200',
    imageUrl: '/images/luang-pu-to-1.jpg',
    imageAlt: 'พระเสมา หลวงปู่โต๊ะ วัดประดู่ฉิมพลี',
    status: 'available',
    category: 'พระเสมา',
    monk: 'หลวงปู่โต๊ะ',
    temple: 'วัดประดู่ฉิมพลี',
    year: '2548',
    material: 'ทองเหลือง',
    condition: 'สภาพดี',
  },
];

try {
  for (const product of products) {
    await connection.execute(
      `INSERT INTO products (name, description, price, imageUrl, imageAlt, status, category, monk, temple, year, material, condition, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.imageAlt,
        product.status,
        product.category,
        product.monk,
        product.temple,
        product.year,
        product.material,
        product.condition,
      ]
    );
    console.log(`✓ Added: ${product.name}`);
  }
  console.log('\n✓ Seed completed successfully!');
} catch (error) {
  console.error('Error seeding products:', error);
} finally {
  await connection.end();
}
