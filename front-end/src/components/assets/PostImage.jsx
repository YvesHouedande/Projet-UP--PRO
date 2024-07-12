import React, { useState, useEffect } from 'react';

const PostImage = ({ image, description }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setLoading(false);
  }, [image]);

  return (
    <div className='m-2 border border-gray-500 rounded-lg overflow-hidden transition-transform duration-500 ease-in-out transform hover:scale-105'>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <img src={image} alt="Post" className='w-full h-48 object-cover' />
      )}
      <div className='p-4'>
        <p className='text-center text-gray-700'>{description}</p>
      </div>
    </div>
  );
};

export default PostImage;
