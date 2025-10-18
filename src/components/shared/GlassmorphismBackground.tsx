const GlassmorphismBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/60 dark:bg-yellow-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/60 dark:bg-emerald-600/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-400/50 dark:bg-green-500/30 rounded-full blur-3xl"></div>
    </div>
  );
};

export default GlassmorphismBackground;
