import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from './pages/Home';
import MediaModal from './media/MediaModal';

function App() {
  return (
    /* We use a custom slate/zinc palette instead of standard gray for a "premium" feel.
       'selection' classes style the text highlight color. 
    */
    <div className="relative flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
      
      {/* 1. Brand Gradient Accent (Thin line at the very top) */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-[100]" />

      {/* 2. Abstract Background Blobs (Adds depth without clutter) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-600/10" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[100px] dark:bg-purple-600/10" />
      </div>

      {/* 3. Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-[#0B0F1A]/70 border-b border-slate-200/60 dark:border-slate-800/60">
        <Header />
      </header>

      {/* 4. Main Content Area with Entry Animation */}
      <main className="relative grow animate-in fade-in slide-in-from-bottom-2 duration-700">
        <Home />
      </main>

      {/* 5. Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F1A]">
        <Footer />
      </footer>

      {/* 6. Portals & Overlays */}
      <MediaModal />
    </div>
  );
}

export default App;