import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data (optional, hapus komentar jika ingin reset)
  // console.log('Cleaning existing data...')
  // await prisma.affiliateClick.deleteMany()
  // await prisma.product.deleteMany()
  // await prisma.inspiration.deleteMany()
  // await prisma.category.deleteMany()
  // console.log('Existing data cleaned.')

  // ========== CATEGORIES ==========
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Streetwear', slug: 'streetwear', icon: '👕' },
      { name: 'Korean Style', slug: 'korean-style', icon: '🇰🇷' },
      { name: 'Old Money', slug: 'old-money', icon: '💎' },
      { name: 'Viral TikTok', slug: 'viral-tiktok', icon: '⚡' },
    ],
    skipDuplicates: true,
  })
  console.log(`✅ Created ${categories.count} categories`)

  // Get category IDs
  const streetwear = await prisma.category.findUnique({ where: { slug: 'streetwear' } })
  const koreanStyle = await prisma.category.findUnique({ where: { slug: 'korean-style' } })
  const oldMoney = await prisma.category.findUnique({ where: { slug: 'old-money' } })

  // ========== PRODUCTS ==========
  if (streetwear && koreanStyle && oldMoney) {
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Oversized Graphic Tee',
          slug: 'oversized-graphic-tee',
          description: 'Cotton oversized t-shirt dengan desain streetwear eksklusif. Bahan adem dan nyaman.',
          price: 189000,
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          modelImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
          shopeeLink: 'https://shopee.co.id/affiliate-link-1',
          categoryId: streetwear.id,
          isTrending: true,
          views: 12340,
          clicks: 2340,
        },
        {
          name: 'Cargo Pants Black',
          slug: 'cargo-pants-black',
          description: 'Cargo pants premium dengan fitur multi-pocket. Desain modern untuk streetwear look.',
          price: 349000,
          imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
          modelImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
          shopeeLink: 'https://shopee.co.id/affiliate-link-2',
          categoryId: streetwear.id,
          isViral: true,
          views: 9870,
          clicks: 2100,
        },
        {
          name: 'Wool Blazer Beige',
          slug: 'wool-blazer-beige',
          description: 'Blazer wool premium warna beige. Cocok untuk gaya old money aesthetic.',
          price: 559000,
          imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500',
          modelImageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
          shopeeLink: 'https://shopee.co.id/affiliate-link-3',
          categoryId: oldMoney.id,
          isTrending: true,
          views: 6540,
          clicks: 1200,
        },
        {
          name: 'Knitted Cardigan',
          slug: 'knitted-cardigan',
          description: 'Cardigan rajutan yang nyaman dan stylish. Korean style look yang viral.',
          price: 279000,
          imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500',
          modelImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
          shopeeLink: 'https://shopee.co.id/affiliate-link-4',
          categoryId: koreanStyle.id,
          isViral: true,
          views: 5430,
          clicks: 980,
        },
      ],
      skipDuplicates: true,
    })
    console.log(`✅ Created ${products.count} products`)
  }

  // ========== INSPIRATIONS ==========
  const inspirations = await prisma.inspiration.createMany({
    data: [
      {
        title: '5 Korean Style Outfit yang Viral di TikTok',
        slug: 'korean-style-outfit-viral',
        excerpt: 'Inspirasi outfit Korean style yang lagi hits di media sosial. Dari gaya casual hingga formal.',
        content: `
          <p>Korean fashion selalu menjadi inspirasi bagi banyak orang. Gaya yang simpel namun tetap stylish membuatnya mudah diadaptasi untuk berbagai kesempatan.</p>
          <h2>1. Oversized Blazer + Wide Pants</h2>
          <p>Kombinasi ini menjadi favorit di TikTok dengan jutaan views.</p>
          <h2>2. Knitted Cardigan + Pleated Skirt</h2>
          <p>Look feminin dengan cardigan rajutan dan rok lipit.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
        tags: ['korean style', 'viral', 'tiktok'],
        views: 1234,
      },
      {
        title: 'Old Money Aesthetic: Elegan Tanpa Berlebihan',
        slug: 'old-money-aesthetic-elegan',
        excerpt: 'Penampilan klasik yang timeless untuk gaya old money. Tips mix and match outfit premium.',
        content: `
          <p>Old money aesthetic adalah gaya berpakaian yang terinspirasi dari kalangan elite tradisional.</p>
          <h2>Ciri-ciri Old Money Style:</h2>
          <ul><li>Warna netral</li><li>Bahan premium</li><li>Siluet yang rapi</li></ul>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        tags: ['old money', 'timeless', 'elegant'],
        views: 2345,
      },
      {
        title: 'Streetwear Guide: 7 Outfit Wajib Pria Masa Kini',
        slug: 'streetwear-guide-7-outfit',
        excerpt: 'Panduan streetwear untuk tampil keren setiap hari. Dari sneakers hingga outerwear.',
        content: `
          <p>Streetwear adalah gaya berpakaian yang terinspirasi dari budaya skate, surf, dan hip-hop.</p>
          <h2>Outfit Wajib:</h2>
          <ul><li>Oversized Graphic Tee</li><li>Cargo Pants</li><li>Bucket Hat</li></ul>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        tags: ['streetwear', 'men fashion'],
        views: 3456,
      },
    ],
    skipDuplicates: true,
  })
  console.log(`✅ Created ${inspirations.count} inspirations`)

  // ========== ADMIN ==========
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@modena.com' },
    update: {},
    create: {
      email: 'admin@modena.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Admin created (admin@modena.com / admin123)')

  console.log('🌱 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })