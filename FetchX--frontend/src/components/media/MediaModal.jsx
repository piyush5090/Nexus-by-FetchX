import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedItem } from '../../features/media/mediaSlice';
import { FiX, FiDownload, FiExternalLink, FiUser, FiMaximize } from 'react-icons/fi';

const MediaModal = () => {
  const dispatch = useDispatch();
  const { selectedItem } = useSelector((state) => state.media);

  if (!selectedItem) return null;

  const handleClose = () => dispatch(clearSelectedItem());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Immersive Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-full border border-white/10">
        
        {/* Close Button - More Integrated */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-20 backdrop-blur-md"
        >
          <FiX size={20} />
        </button>

        {/* 1. Media Preview Area (Dark Section) */}
        <div className="flex-grow bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          {selectedItem.type === 'image' ? (
            <img 
              src={selectedItem.url} 
              alt={selectedItem.tags?.[0]} 
              className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain select-none shadow-2xl"
            />
          ) : (
            <video 
              src={selectedItem.url} 
              className="max-w-full max-h-[70vh] md:max-h-[85vh]" 
              controls 
              autoPlay 
            />
          )}
        </div>

        {/* 2. Metadata Sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded uppercase tracking-wider">
                {selectedItem.source}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                {selectedItem.width} × {selectedItem.height}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiMaximize className="text-gray-400" /> Asset Details
            </h3>

            {/* Author Section */}
            {selectedItem.photographer && (
              <div className="mb-6 group">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Creator</p>
                <a 
                  href={selectedItem.photographer_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600">
                    <FiUser size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate dark:text-gray-200">{selectedItem.photographer}</p>
                    <p className="text-xs text-blue-500 flex items-center gap-1">View Portfolio <FiExternalLink size={10} /></p>
                  </div>
                </a>
              </div>
            )}

            {/* Tags Section */}
            {selectedItem.tags?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase font-bold mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons at Bottom */}
          <div className="space-y-3 mt-auto">
            <button 
               onClick={() => window.open(selectedItem.url, '_blank')}
               className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <FiDownload size={18} /> Download High-Res
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;