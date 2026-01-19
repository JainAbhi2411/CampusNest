import React from 'react';

const MorphingBlobs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Morphing Blob 1 */}
      <svg
        className="absolute -top-20 -left-20 w-96 h-96 xl:w-[600px] xl:h-[600px]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blob-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          fill="url(#blob-gradient-1)"
          className="animate-morph-blob-1"
        >
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="
              M45.7,-58.5C58.9,-49.4,69.4,-35.9,73.8,-20.3C78.2,-4.7,76.5,13,69.1,27.9C61.7,42.8,48.6,55,33.4,62.8C18.2,70.6,0.9,74,-16.3,72.8C-33.5,71.6,-50.6,65.8,-62.8,54.5C-75,43.2,-82.3,26.4,-83.5,9.3C-84.7,-7.8,-79.8,-25.2,-69.7,-38.9C-59.6,-52.6,-44.3,-62.6,-28.5,-70.4C-12.7,-78.2,3.6,-83.8,18.9,-81.6C34.2,-79.4,48.5,-69.4,45.7,-58.5Z;
              
              M39.3,-54.2C50.8,-45.3,60.3,-33.5,65.4,-19.8C70.5,-6.1,71.2,9.5,66.3,23.4C61.4,37.3,50.9,49.5,38.1,58.3C25.3,67.1,10.2,72.5,-5.3,70.8C-20.8,69.1,-36.7,60.3,-48.9,48.9C-61.1,37.5,-69.6,23.5,-72.8,8.2C-76,-7.1,-73.9,-23.7,-65.9,-36.9C-57.9,-50.1,-44,-59.9,-29.5,-67.3C-15,-74.7,0.1,-79.7,13.8,-77.2C27.5,-74.7,39.8,-64.7,39.3,-54.2Z;
              
              M45.7,-58.5C58.9,-49.4,69.4,-35.9,73.8,-20.3C78.2,-4.7,76.5,13,69.1,27.9C61.7,42.8,48.6,55,33.4,62.8C18.2,70.6,0.9,74,-16.3,72.8C-33.5,71.6,-50.6,65.8,-62.8,54.5C-75,43.2,-82.3,26.4,-83.5,9.3C-84.7,-7.8,-79.8,-25.2,-69.7,-38.9C-59.6,-52.6,-44.3,-62.6,-28.5,-70.4C-12.7,-78.2,3.6,-83.8,18.9,-81.6C34.2,-79.4,48.5,-69.4,45.7,-58.5Z
            "
          />
        </path>
      </svg>

      {/* Morphing Blob 2 */}
      <svg
        className="absolute -bottom-20 -right-20 w-96 h-96 xl:w-[700px] xl:h-[700px]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blob-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          fill="url(#blob-gradient-2)"
          className="animate-morph-blob-2"
        >
          <animate
            attributeName="d"
            dur="25s"
            repeatCount="indefinite"
            values="
              M41.3,-56.7C52.9,-47.5,61.5,-34.2,66.3,-19.2C71.1,-4.2,72.1,12.5,67.4,27.4C62.7,42.3,52.3,55.4,38.9,63.8C25.5,72.2,9.1,76,-7.8,75.3C-24.7,74.6,-42.1,69.4,-55.3,58.9C-68.5,48.4,-77.5,32.6,-79.8,15.7C-82.1,-1.2,-77.7,-19.2,-68.9,-34.5C-60.1,-49.8,-46.9,-62.4,-32.3,-70.3C-17.7,-78.2,-1.7,-81.4,13.2,-78.9C28.1,-76.4,42.7,-68.2,41.3,-56.7Z;
              
              M47.3,-63.8C60.5,-54.3,69.8,-39.5,74.6,-23.2C79.4,-6.9,79.7,11,74.1,26.9C68.5,42.8,57,56.7,42.8,65.3C28.6,73.9,11.7,77.2,-5.6,76.3C-22.9,75.4,-40.5,70.3,-54.3,59.9C-68.1,49.5,-78.1,33.8,-80.8,16.8C-83.5,-0.2,-78.9,-18.5,-69.8,-33.5C-60.7,-48.5,-47.1,-60.2,-32.1,-68.9C-17.1,-77.6,-0.7,-83.3,14.8,-81.4C30.3,-79.5,45.1,-70,47.3,-63.8Z;
              
              M41.3,-56.7C52.9,-47.5,61.5,-34.2,66.3,-19.2C71.1,-4.2,72.1,12.5,67.4,27.4C62.7,42.3,52.3,55.4,38.9,63.8C25.5,72.2,9.1,76,-7.8,75.3C-24.7,74.6,-42.1,69.4,-55.3,58.9C-68.5,48.4,-77.5,32.6,-79.8,15.7C-82.1,-1.2,-77.7,-19.2,-68.9,-34.5C-60.1,-49.8,-46.9,-62.4,-32.3,-70.3C-17.7,-78.2,-1.7,-81.4,13.2,-78.9C28.1,-76.4,42.7,-68.2,41.3,-56.7Z
            "
          />
        </path>
      </svg>

      {/* Morphing Blob 3 - Center */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] xl:w-[800px] xl:h-[800px]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blob-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          fill="url(#blob-gradient-3)"
          className="animate-morph-blob-3"
        >
          <animate
            attributeName="d"
            dur="30s"
            repeatCount="indefinite"
            values="
              M43.5,-58.9C56.3,-50.2,66.8,-37.8,72.5,-23.1C78.2,-8.4,79.1,8.6,74.3,24.3C69.5,40,59,54.4,45.3,63.5C31.6,72.6,14.8,76.4,-1.8,75.3C-18.4,74.2,-34.9,68.2,-48.7,57.9C-62.5,47.6,-73.6,33,-77.8,16.8C-82,-0.4,-79.3,-19.2,-71.2,-35.3C-63.1,-51.4,-49.6,-64.8,-34.5,-72.3C-19.4,-79.8,-2.7,-81.4,12.8,-78.6C28.3,-75.8,43.5,-68.6,43.5,-58.9Z;
              
              M38.7,-52.3C49.8,-43.5,58.5,-31.5,63.7,-17.8C68.9,-4.1,70.6,11.3,66.8,25.1C63,38.9,53.7,51.1,41.5,59.8C29.3,68.5,14.1,73.7,-1.5,73.2C-17.1,72.7,-33.2,66.5,-46.3,56.3C-59.4,46.1,-69.5,32,-74.3,16.1C-79.1,0.2,-78.6,-17.5,-72.3,-33.1C-66,-48.7,-53.9,-62.2,-39.8,-69.8C-25.7,-77.4,-9.6,-79.1,4.3,-76.8C18.2,-74.5,36.4,-68.2,38.7,-52.3Z;
              
              M43.5,-58.9C56.3,-50.2,66.8,-37.8,72.5,-23.1C78.2,-8.4,79.1,8.6,74.3,24.3C69.5,40,59,54.4,45.3,63.5C31.6,72.6,14.8,76.4,-1.8,75.3C-18.4,74.2,-34.9,68.2,-48.7,57.9C-62.5,47.6,-73.6,33,-77.8,16.8C-82,-0.4,-79.3,-19.2,-71.2,-35.3C-63.1,-51.4,-49.6,-64.8,-34.5,-72.3C-19.4,-79.8,-2.7,-81.4,12.8,-78.6C28.3,-75.8,43.5,-68.6,43.5,-58.9Z
            "
          />
        </path>
      </svg>

      {/* Floating Rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 xl:w-96 xl:h-96">
        <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-ping-slow" />
        <div className="absolute inset-4 rounded-full border-2 border-accent/20 animate-ping-slower" />
        <div className="absolute inset-8 rounded-full border-2 border-primary/20 animate-ping-slowest" />
      </div>
    </div>
  );
};

export default MorphingBlobs;
