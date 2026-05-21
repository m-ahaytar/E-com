import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SpaceBackground.css';

const IMMERSIVE_PATHS = ['/'];
const FUNCTIONAL_PATHS = ['/catalogue', '/product', '/deals'];

const resolveGroup = (pathname) => {
  if (IMMERSIVE_PATHS.includes(pathname)) return 'immersive';
  if (FUNCTIONAL_PATHS.some((path) => pathname.startsWith(path))) return 'functional';
  return 'utility';
};

const SpaceBackground = () => {
  const { pathname } = useLocation();
  const [videoFailed, setVideoFailed] = useState(false);
  const group = resolveGroup(pathname);

  useEffect(() => {
    setVideoFailed(false);
  }, [group]);

  const videoSrc = useMemo(() => (
    group === 'immersive'
      ? 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4'
      : ''
  ), [group]);

  const fallbackSrc = 'https://videos.pexels.com/video-files/856309/856309-hd_1920_1080_25fps.mp4';

  return (
    <div className={`space-background space-background--${group}`} aria-hidden="true">
      {group === 'immersive' && !videoFailed && (
        <video
          autoPlay
          className="space-background__video"
          loop
          muted
          onError={() => setVideoFailed(true)}
          playsInline
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={fallbackSrc} type="video/mp4" />
        </video>
      )}
      <div className="space-background__gradient"></div>
      <div className="space-background__stars">
        <div className="stars-sm"></div>
        <div className="stars-md"></div>
        <div className="stars-lg"></div>
      </div>
    </div>
  );
};

export default SpaceBackground;
