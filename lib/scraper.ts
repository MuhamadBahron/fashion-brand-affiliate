export async function scrapeShopeeProduct(url: string) {
  try {
    console.log('🚀 Scraping:', url);
    
    // --- 1. Dapatkan URL final (ikuti redirect) ---
    let finalUrl = url;
    if (url.includes('s.shopee.co.id')) {
      console.log('Following redirect...');
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      finalUrl = response.url;
      console.log('Redirected to:', finalUrl);
    }
    
    // --- 2. Ekstrak Product ID dengan Regex yang Lebih Baik ---
    let productId = null;
    
    // Pola 1: URL lama dengan format .../i.123456789.123456789...
    const idMatch1 = finalUrl.match(/i\.(\d+)\./);
    if (idMatch1) productId = idMatch1[1];
    
    // Pola 2: URL baru dengan format .../-i.123456789
    if (!productId) {
      const idMatch2 = finalUrl.match(/-i\.(\d+)/);
      if (idMatch2) productId = idMatch2[1];
    }
    
    // Pola 3: Dari parameter "shopid" dan "itemid" (untuk link yang sangat panjang)
    if (!productId) {
      const shopIdMatch = finalUrl.match(/shopid=(\d+)/);
      const itemIdMatch = finalUrl.match(/itemid=(\d+)/);
      if (shopIdMatch && itemIdMatch) {
        // Untuk API, kita hanya perlu salah satu ID. Tapi kita simpan untuk debugging.
        productId = itemIdMatch[1]; 
        console.log(`Found itemid: ${productId} from URL parameters`);
      }
    }
    
    // Pola 4: Coba ambil dari pathname setelah domain (fallback terakhir)
    if (!productId) {
      const urlObj = new URL(finalUrl);
      const pathParts = urlObj.pathname.split('/');
      for (const part of pathParts) {
        if (part && /^\d+$/.test(part) && part.length > 5) {
          productId = part;
          break;
        }
      }
    }
    
    if (!productId) {
      console.error('Could not extract product ID from URL:', finalUrl);
      return fallbackData(url);
    }
    
    console.log('✅ Product ID extracted:', productId);
    
    // --- 3. Panggil API Shopee ---
    const apiUrl = `https://shopee.co.id/api/v4/product/get_shopee_product_info?product_id=${productId}`;
    console.log('Calling API:', apiUrl);
    
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://shopee.co.id/',
      }
    });
    
    if (!apiResponse.ok) {
      console.error(`API returned status ${apiResponse.status}`);
      return fallbackData(url);
    }
    
    const data = await apiResponse.json();
    
    if (data && data.data) {
      const product = data.data;
      
      let name = product.name || 'Product from Shopee';
      name = name.length > 100 ? name.substring(0, 100) : name;
      
      let price = product.price_min || product.price_max || 0;
      if (price > 1000) {
        price = Math.floor(price / 100000); // Konversi jika perlu
      }
      
      let imageUrl = '';
      if (product.images && product.images[0]) {
        imageUrl = `https://cf.shopee.co.id/file/${product.images[0]}`;
      }
      
      let description = product.description || '';
      if (description) {
        description = description.replace(/<[^>]*>/g, '').substring(0, 300);
      }
      
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      console.log('✅ Scraping successful:', { name, price });
      
      return {
        name: name,
        price: price,
        imageUrl: imageUrl || 'https://via.placeholder.com/500',
        description: description || `Produk fashion berkualitas dari Shopee.`,
        slug: slug,
      };
    }
    
    console.warn('API returned but no product data found.');
    return fallbackData(url);
    
  } catch (error) {
    console.error('Scraping error:', error);
    return fallbackData(url);
  }
}

function fallbackData(url: string) {
  const fallbackName = extractNameFromUrl(url);
  return {
    name: fallbackName,
    price: 0,
    imageUrl: 'https://via.placeholder.com/500?text=Product+Image',
    description: `Masukkan detail produk secara manual.`,
    slug: fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };
}

function extractNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    for (const part of pathParts) {
      if (part && part.length > 5 && !part.includes('.')) {
        return part.replace(/-/g, ' ').substring(0, 50);
      }
    }
  } catch (e) {}
  return 'Product from Shopee';
}
