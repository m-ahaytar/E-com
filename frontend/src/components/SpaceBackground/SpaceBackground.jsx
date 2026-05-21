import { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useScrollProgress from '../../hooks/useScrollProgress';
import './SpaceBackground.css';

const IMMERSIVE_PATHS = ['/'];
const FUNCTIONAL_PATHS = ['/catalogue', '/product', '/deals'];

const resolveGroup = (pathname) => {
  if (IMMERSIVE_PATHS.includes(pathname)) return 'immersive';
  if (FUNCTIONAL_PATHS.some((path) => pathname.startsWith(path))) return 'functional';
  return 'utility';
};

const MAX_VIDEO_RETRIES = 2;

const SpaceBackground = () => {
  const { pathname } = useLocation();
  const [videoRetries, setVideoRetries] = useState(0);
  const group = resolveGroup(pathname);

  const handleVideoError = useCallback(() => {
    setVideoRetries((prev) => Math.min(prev + 1, MAX_VIDEO_RETRIES));
  }, []);

  const { scrollY } = useScrollProgress();

  const videoSrc = useMemo(() => (
    group === 'immersive'
      ? 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'
      : ''
  ), [group]);

  const fallbackSrc = 'https://videos.pexels.com/video-files/856309/856309-hd_1920_1080_25fps.mp4';

  const starStyleSm = { transform: `translateY(${scrollY * 0.02}px)` };
  const starStyleMd = { transform: `translateY(${scrollY * 0.05}px)` };
  const starStyleLg = { transform: `translateY(${scrollY * 0.08}px)` };

  return (
    <div className={`space-background space-background--${group}`} aria-hidden="true">
      {group === 'immersive' && videoRetries < MAX_VIDEO_RETRIES && (
        <video
          autoPlay
          className="space-background__video"
          key={`${group}-${videoRetries}`}
          loop
          muted
          onError={handleVideoError}
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={fallbackSrc} type="video/mp4" />
        </video>
      )}
      <div className="space-background__gradient"></div>
      <div className="space-background__evolution" style={{ opacity: Math.min(scrollY / 1200, 0.6) }}></div>
      <div className="space-background__stars">
        <div className="stars-sm" style={starStyleSm}></div>
        <div className="stars-md" style={starStyleMd}></div>
        <div className="stars-lg" style={starStyleLg}></div>
      </div>
    </div>
  );
};

export default SpaceBackground;
