import { useEffect, useState } from 'react';
import { EntryScreen } from './components/EntryScreen';
import { ImageGallery } from './components/ImageGallery';
import { FinalMessage } from './components/FinalMessage';
import { AdminPanel } from './components/AdminPanel';

type Screen = 'entry' | 'gallery' | 'message';

function App() {
  const [screen, setScreen] = useState<Screen>('entry');
  const [userName, setUserName] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProceed = (name: string) => {
    setUserName(name);
    setScreen('gallery');
  };

  const handleGalleryComplete = () => {
    setScreen('message');
  };

  const handleRestart = () => {
    setUserName('');
    setScreen('entry');
  };

  return (
    <>
      {screen === 'entry' && <EntryScreen onProceed={handleProceed} />}
      {screen === 'gallery' && <ImageGallery onComplete={handleGalleryComplete} />}
      {screen === 'message' && <FinalMessage name={userName} onRestart={handleRestart} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </>
  );
}

export default App;
