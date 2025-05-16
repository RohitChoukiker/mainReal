import { useEffect } from 'react';

/**
 * A hook to preload images to improve initial load performance
 * @param imageSources Array of image URLs to preload
 */
export function usePreloadImages(imageSources: string[]) {
  useEffect(() => {
    // Create an array to store the image objects
    const imageObjects: HTMLImageElement[] = [];
    
    // Function to preload a single image
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      imageObjects.push(img);
    };
    
    // Preload all images
    imageSources.forEach(preloadImage);
    
    // Cleanup function
    return () => {
      // Clear references to image objects
      imageObjects.length = 0;
    };
  }, [imageSources]);
}