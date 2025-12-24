import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FiDownload, FiMaximize2, FiPlay } from 'react-icons/fi';
import { setSelectedItem } from '../../features/media/mediaSlice';

const MediaItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  // Source branding map
  const sourceBrands = {
    unsplash: 'bg-black text-white',
    pexels: 'bg-[#05a081] text-white',
    pixabay: 'bg-[#2ec66d] text-white',
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.source}-${item.id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div
      className="relative group cursor-zoom-in overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => {
        setIsHovered(true);
        videoRef.current?.play();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
      onClick={() => dispatch(setSelectedItem(item))}
    >
      {/* Content Rendering */}
      {item.type === 'image' ? (
        <img 
          src={item.previewURL} 
          alt={item.tags[0]} 
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      ) : (
        <div className="relative">
          <video 
            ref={videoRef}
            src={item.previewURL} 
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
            muted loop playsInline
          />
          {!isHovered && (
            <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
              <FiPlay size={14} fill="white" />
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg ${sourceBrands[item.source.toLowerCase()] || 'bg-blue-600 text-white'}`}>
            {item.source}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between text-white">
          <div className="flex-1 min-w-0 pr-4">
            <p className="font-bold text-sm truncate capitalize">{item.tags[0] || 'Asset'}</p>
            <p className="text-xs opacity-70 truncate">by {item.photographer || 'Creator'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="p-3 bg-white text-slate-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              <FiDownload size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaItem;