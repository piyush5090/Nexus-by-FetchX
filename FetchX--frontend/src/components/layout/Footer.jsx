import React from 'react';
import { LuLayers, LuGithub, LuTwitter, LuGlobe, LuExternalLink } from 'react-icons/lu';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sources = [
    { name: 'Pexels', url: 'https://www.pexels.com/api/' },
    { name: 'Unsplash', url: 'https://unsplash.com/developers' },
    { name: 'Pixabay', url: 'https://pixabay.com/api/docs/' },
  ];

  return (
    <footer className="bg-white dark:bg-[#0b101b] border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-md shadow-blue-500/20">
                <LuLayers className="text-white" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase italic dark:text-white">
                Media<span className="text-blue-600">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The world's most powerful unified media aggregator. Search millions of high-resolution assets from top-tier providers in one place.
            </p>
            <div className="flex gap-4 text-slate-400">
              <LuGithub className="hover:text-blue-600 cursor-pointer transition-colors" />
              <LuTwitter className="hover:text-blue-600 cursor-pointer transition-colors" />
              <LuGlobe className="hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Sources Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Integrated Sources
            </h4>
            <ul className="space-y-2">
              {sources.map((source) => (
                <li key={source.name}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center gap-1 transition-colors"
                  >
                    {source.name} API
                    <LuExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">License Agreement</li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              Status
            </h4>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-green-700 dark:text-green-500 uppercase">All Systems Operational</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {currentYear} MediaHub Labs. Built for creatives worldwide.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-[0.2em]">
              Integrated Media Solution
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;