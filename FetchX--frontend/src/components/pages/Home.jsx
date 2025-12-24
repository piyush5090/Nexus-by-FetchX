import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, setPage, fetchSearchCounts, setSearchTerms } from '../../features/media/mediaSlice';
import SearchBar from '../search/SearchBar';
import MediaGrid from '../media/MediaGrid';
import ProviderStats from '../search/ProviderStats';
import { LuChevronLeft, LuChevronRight, LuLoader, LuLayers, LuZap } from 'react-icons/lu';

const Home = () => {
  const dispatch = useDispatch();
  const { query, mediaType, page, items, status, error } = useSelector((state) => state.media);

  // Effect for fetching media items
  useEffect(() => {
    if(query) { // Only fetch if there's a query
      dispatch(fetchMedia());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, query, mediaType, page]);

  // Effect for fetching provider counts
  useEffect(() => {
    if(query) {
      dispatch(fetchSearchCounts());
    }
  }, [dispatch, query, mediaType]);

  const handleNextPage = () => dispatch(setPage(page + 1));
  const handlePrevPage = () => page > 1 && dispatch(setPage(page - 1));

  // Determine if we should show the "Hero" feel (only on landing/page 1)
  const isLanding = useMemo(() => !query && page === 1, [query, page]);
  
  const handleMediaTypeChange = (newType) => {
    if (mediaType !== newType) {
      dispatch(setSearchTerms({ query, mediaType: newType }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      
      {/* 1. Dynamic Hero / Header Section */}
      <header className={`relative transition-all duration-700 ${isLanding ? 'py-24' : 'py-6'} border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f1a] sticky top-0 z-40 shadow-sm`}>
        <div className="container mx-auto px-6">
          <div className={`flex flex-col gap-8 ${isLanding ? 'items-center text-center' : 'md:flex-row md:items-center md:justify-between'}`}>
            
            {/* Branding */}
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isLanding ? 'justify-center' : ''}`}>
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <LuLayers className="text-white" size={isLanding ? 32 : 20} />
                </div>
                <h1 className={`${isLanding ? 'text-4xl' : 'text-xl'} font-black tracking-tighter text-slate-900 dark:text-white uppercase italic`}>
                  Media<span className="text-blue-600">Hub</span>
                </h1>
              </div>
              {isLanding && (
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-4 text-lg font-medium">
                  The ultimate unified library for <span className="text-slate-900 dark:text-white underline decoration-blue-500 underline-offset-4">Pexels</span>, <span className="text-slate-900 dark:text-white underline decoration-purple-500 underline-offset-4">Unsplash</span>, and <span className="text-slate-900 dark:text-white underline decoration-teal-500 underline-offset-4">Pixabay</span>.
                </p>
              )}
            </div>

            {/* Search Bar Container */}
            <div className={`transition-all duration-500 ${isLanding ? 'w-full max-w-2xl mt-4' : 'w-full md:w-1/2'}`}>
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Discovery Area */}
      <main className="container mx-auto px-6 py-10">
        
        {/* Results Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            <div>
              <h2 className="text-sm uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">Discovery</h2>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {query ? `Results for "${query}"` : "Trending Assets"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ProviderStats />
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <button onClick={() => handleMediaTypeChange('images')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mediaType === 'images' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  Photos
              </button>
              <button onClick={() => handleMediaTypeChange('videos')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mediaType === 'videos' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  Motion
              </button>
            </div>
          </div>
        </div>

        {/* The Media Feed */}
        <div className="min-h-[400px]">
          <MediaGrid 
            key={`${query}-${mediaType}`} 
            items={items} 
            status={status} 
            error={error}
          />
        </div>

        {/* 3. Floating Modern Pagination */}
        {items.length > 0 && (
          <div className="mt-20 mb-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <LuZap className="text-yellow-500" /> Powered by Multi-Source API
            </div>
            
            <nav className="inline-flex items-center p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-x-3">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || status === 'loading'}
                className="p-3 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 group"
              >
                <LuChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="h-10 w-[2px] bg-slate-200 dark:bg-slate-800 mx-2" />

              <div className="flex items-center gap-4 px-4">
                <span className="text-xs font-black text-slate-400 uppercase">Page</span>
                <div className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-blue-600 rounded-2xl text-white font-black text-xl shadow-lg shadow-blue-500/20">
                  {status === 'loading' ? <LuLoader className="animate-spin" size={20} /> : page}
                </div>
              </div>

              <div className="h-10 w-[2px] bg-slate-200 dark:bg-slate-800 mx-2" />

              <button
                onClick={handleNextPage}
                disabled={items.length === 0 || status === 'loading'}
                className="p-3 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 group"
              >
                <LuChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;