// import { useEffect, useState } from 'react';

// export const useMediaQuery = () => {
//   const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop' | null>(
//     null
//   );

//   const [dimensions, setDimensions] = useState<{
//     width: number;
//     height: number;
//   } | null>(null);

//   useEffect(() => {
//     const checkDevice = () => {
//       if (window.matchMedia('(max-width: 640px)').matches) {
//         setDevice('mobile');
//       } else if (
//         window.matchMedia('(min-width: 641px) and (max-width: 1024px)')
//       ) {
//         setDevice('tablet');
//       } else {
//         setDevice('desktop');
//       }
//     };

//     checkDevice();

//     window.addEventListener('resize', checkDevice);

//     return () => {
//       window.removeEventListener('resize', checkDevice);
//     };
//   }, []);

//   return {
//     device,
//     width: dimensions?.width,
//     height: dimensions?.height,
//     isMobile: device === 'mobile',
//     isTablet: device === 'tablet',
//     isDesktop: device === 'desktop',
//   };
// };

import { useEffect, useState } from 'react';

export const useMediaQuery = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop' | null>(
    null
  );

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const updateDeviceAndDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update dimensions
      setDimensions({ width, height });

      // Update device type
      if (width <= 640) {
        setDevice('mobile');
      } else if (width > 640 && width <= 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    updateDeviceAndDimensions();

    window.addEventListener('resize', updateDeviceAndDimensions);

    return () => {
      window.removeEventListener('resize', updateDeviceAndDimensions);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
  };
};
