import { useState } from 'react';
import { X, Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  onClose: () => void;
}

interface ImageItem {
  id: string;
  image_url: string;
  display_order: number;
  caption: string;
}

const ADMIN_PASSWORD = 'NewYear2025Admin!';

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [step, setStep] = useState<'login' | 'dashboard'>('login');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep('dashboard');
      setPassword('');
      setError('');
      loadImages();
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const loadImages = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('greeting_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (!err && data) {
      setImages(data as ImageItem[]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('greeting-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('greeting-images')
        .getPublicUrl(fileName);

      const nextOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) + 1 : 0;

      const { error: insertError } = await supabase
        .from('greeting_images')
        .insert({
          image_url: publicData.publicUrl,
          display_order: nextOrder,
          caption: caption || '',
        });

      if (insertError) throw insertError;

      setCaption('');
      await loadImages();
    } catch (err) {
      setError('Failed to upload image');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this image?')) {
      const { error } = await supabase
        .from('greeting_images')
        .delete()
        .eq('id', id);

      if (!error) {
        await loadImages();
      }
    }
  };

  const handleReorder = async (id: string, newOrder: number) => {
    await supabase
      .from('greeting_images')
      .update({ display_order: newOrder })
      .eq('id', id);

    await loadImages();
  };

  if (step === 'login') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Access</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">Image Gallery Management</h2>

        <div className="mb-8 p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <div className="space-y-4">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption (optional)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition">
              <Upload className="w-5 h-5" />
              <span className="font-semibold">{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Images ({images.length})</h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : images.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {images.map((image, idx) => (
                <div key={image.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <img src={image.image_url} alt="preview" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{image.caption || 'No caption'}</p>
                    <p className="text-sm text-gray-600">Order: {image.display_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorder(image.id, Math.max(0, image.display_order - 1))}
                      disabled={idx === 0}
                      className="px-3 py-1 bg-slate-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-400"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(image.id, image.display_order + 1)}
                      disabled={idx === images.length - 1}
                      className="px-3 py-1 bg-slate-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-400"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
