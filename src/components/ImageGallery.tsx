import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageItem {
  id: string;
  image_url: string;
  display_order: number;
  caption: string;
}

interface ImageGalleryProps {
  onComplete: () => void;
}

export function ImageGallery({ onComplete }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const { data } = await supabase
        .from('greeting_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (data) {
        setImages(data as ImageItem[]);
      }
      setLoading(false);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (displayedCount < images.length) {
      const timer = setTimeout(() => {
        setDisplayedCount(displayedCount + 1);
      }, 800);

      return () => clearTimeout(timer);
    } else if (images.length > 0 && displayedCount === images.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [displayedCount, images.length, onComplete]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-rose-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <p className="relative text-white text-xl">Loading memories...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-rose-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative text-center space-y-6 max-w-lg">
          <p className="text-white text-2xl font-semibold">No memories yet</p>
          <p className="text-slate-300 text-lg">Check back later for beautiful moments from 2025</p>
          <button
            onClick={onComplete}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-rose-900 p-4 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="relative max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={`transition-all duration-700 transform ${
                idx < displayedCount
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-8'
              }`}
            >
              <div className="relative group overflow-hidden rounded-xl bg-slate-800">
                <img
                  src={image.image_url}
                  alt={image.caption}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayedCount === images.length && (
          <div className="flex justify-center animate-pulse">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg transition"
            >
              View Your Message
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
