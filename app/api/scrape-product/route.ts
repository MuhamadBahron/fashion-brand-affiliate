import { NextRequest, NextResponse } from 'next/server';
import { scrapeShopeeProduct } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL tidak ditemukan' }, { status: 400 });
    }

    if (!url.includes('shopee.co.id')) {
      return NextResponse.json({ error: 'Harap masukkan link produk Shopee yang valid.' }, { status: 400 });
    }

    const productData = await scrapeShopeeProduct(url);

    if (!productData) {
      return NextResponse.json({ error: 'Gagal mengambil data produk. Coba lagi nanti.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: productData });
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
