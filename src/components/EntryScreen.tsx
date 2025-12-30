import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EntryScreenProps {
  onProceed: (name: string) => void;
}

export function EntryScreen({ onProceed }: EntryScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid name');
      return;
    }

    const { error: dbError } = await supabase
      .from('visitors')
      .insert({ name: name.trim() });

    if (dbError) {
      console.error('Error saving visitor:', dbError);
    }

    onProceed(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              backgroundColor: ['rgba(147, 51, 234, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(244, 63, 94, 0.6)'][Math.floor(Math.random() * 3)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-2xl w-full">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-center gap-3 items-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Welcome to 2025
              </h1>
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              A beautiful journey through your memories and moments from this year.
              Let's celebrate the memories you've created and look forward to new adventures ahead.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/40 shadow-lg">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 text-left">
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Enter your name..."
                className="w-full px-6 py-3 bg-white/70 border border-purple-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Begin the Journey
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
