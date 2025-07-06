// components/LazyYouTube.jsx
import React from "react";
import { useInView } from "react-intersection-observer";
import YouTube from "react-youtube";

const LazyYouTube = ({ videoId, opts }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} style={{ minHeight: '390px', marginBottom: '2rem' }}>
      {inView ? (
        <YouTube videoId={videoId} opts={opts} />
      ) : (
        <div style={{
          width: opts.width,
          height: opts.height,
          background: '#000',
          borderRadius: '12px'
        }} />
      )}
    </div>
  );
};

export default LazyYouTube;
