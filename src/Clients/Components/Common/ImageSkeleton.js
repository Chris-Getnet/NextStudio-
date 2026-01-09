import React from 'react';

const ImageSkeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-48',
  rounded = 'rounded-lg',
  animate = true
}) => {
  return (
    <div
      className={`${width} ${height} bg-gray-200 ${rounded} ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
    >
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  );
};

export default ImageSkeleton;



