'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Eye, Loader2 } from 'lucide-react';

interface Inspiration {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  createdAt: string;
  views: number;
  tags: string[];
}

export default function InspirationContent() {
  const [articles, setArticles] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/inspirations');
        const result = await response.json();
        if (result.success) {
          setArticles(result.inspirations);
        }
      } catch (error) {
        console.error('Failed to fetch inspirations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-800" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            Outfit Inspiration
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Temukan ide gaya terbaru dari lookbook kami. Dapatkan tips mix and match untuk tampil
            beda setiap hari.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No articles found. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/inspiration/${article.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {article.views.toLocaleString()} views
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 font-medium group-hover:gap-3 transition-all">
                    <span>Read Article</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
