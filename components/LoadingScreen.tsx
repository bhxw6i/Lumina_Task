
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-lumina-400 flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Animated Glow Rings */}
        <div className="absolute inset-0 bg-lumina-200 blur-2xl rounded-full animate-pulse opacity-20"></div>
        <div className="w-20 h-20 border-4 border-lumina-100/20 border-t-lumina-100 rounded-full animate-spin"></div>
      </div>
      <h1 className="mt-8 font-serif text-4xl text-lumina-50 tracking-wider animate-bounce">
        LuminaTask
      </h1>
      <p className="mt-2 text-lumina-100/60 font-light tracking-[0.2em] uppercase text-xs">
        Crafting your flow...
      </p>
    </div>
  );
};

export default LoadingScreen;
