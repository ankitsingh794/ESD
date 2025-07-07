import React from "react";
import { useInView } from "react-intersection-observer";
import YouTube from "react-youtube";
import "./LazyYouTube.css"; // make sure this contains the styles

const LazyYouTube = ({ videoId }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="video-wrapper" ref={ref}>
      {inView ? (
        <YouTube
          videoId={videoId}
          className="video-iframe"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
            },
          }}
        />
      ) : (
        <div className="video-placeholder" />
      )}
    </div>
  );
};

export default LazyYouTube;
