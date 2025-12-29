import { useState, useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';

interface FinalMessageProps {
  name: string;
  onRestart: () => void;
}

export function FinalMessage({ name, onRestart }: FinalMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-rose-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              backgroundColor: ['rgba(255,255,255,0.8)', 'rgba(147,197,253,0.6)', 'rgba(196,181,253,0.6)'][Math.floor(Math.random() * 3)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>

      <div
        className={`relative max-w-2xl w-full transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-red-400 animate-bounce" />
              <Heart className="w-6 h-6 text-red-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <Heart className="w-6 h-6 text-red-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Dear{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>
          </div>

          <div className="space-y-6 text-lg text-slate-200 leading-relaxed">
            <p>
              As we wave goodbye to 2025, we want to celebrate the beautiful moments you've created and the memories you've shared with us. Every smile, every laugh, and every milestone have been truly special.
            </p>

            <p>
              Looking back at the memories from this year reminds us of your incredible journey. The photos you've seen capture not just moments, but the essence of joy, growth, and connection. Each image tells a story of your life—moments that matter, people you cherish, and experiences that shape who you are.
            </p>

            <p>
              These memories are the threads that connect your past to your future. They remind us of where we've been so we can appreciate where we're going.
            </p>

            <div className="border-l-4 border-amber-400 pl-6 py-4 bg-white/5 rounded">
              <p className="text-amber-100 italic">
                "As you step into 2026, carry these precious moments with you. Let them inspire your next chapter, fuel your dreams, and remind you of your strength. The best memories are yet to come."
              </p>
            </div>

            <p>
              We believe 2026 will bring even more amazing moments—new adventures, deeper connections, and achievements you haven't yet imagined. As you create new memories in the year ahead, remember that you're building a legacy of joy, resilience, and love.
            </p>

            <p className="pt-4 text-center">
              <span className="text-amber-300 font-semibold">Thank you for sharing your 2025 with us.</span> Here's to the memories we've made and the ones we'll make together in 2026 and beyond.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Share With Another Person
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center text-slate-400 text-sm pt-4">
            <p>Made with love for 2025 memories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
