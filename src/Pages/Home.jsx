import React from "react";
import LazyYouTube from "../Components/LazyYouTube";
import SplitText from "../Components/SplitText";
import StarBorder from "../Components/StarBorder";
import Navbar from "../Components/Navbar";
import './Style/Home.css';

export default function Home() {
    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0, // or 0
        }
    };


    return (
        <div className="home">
            <Navbar />
            <div className="home-container">
            <div className="home-content">
                <SplitText
                    text="EmpowerHub"
                    className="text-10xl font-semibold text-center font-tangerine"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                />
                <br/>Empowering You to Build, Learn, and Lead.
                <div className="home-buttons">
                <StarBorder
                    as="button"
                    className="custom-class"
                    color="magenta"
                    speed="5s"
                >
                    Get Started
                </StarBorder>
                </div>
                </div>
                <img src="https://res.cloudinary.com/divulwxho/image/upload/v1751714762/img1_pxoc9g.svg" alt="Placeholder" className="image-1" />
            </div>

            <div className="home-content-2">
                <SplitText
                    text="Videos"
                    className="text-10xl font-semibold text-center font-tangerine"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />
            </div>
            <div className="yt-videos">
            <LazyYouTube videoId="J11Qme3vAio" opts={opts} />
            <LazyYouTube videoId="T9ti0_I04Xs" opts={opts} />
            <LazyYouTube videoId="2qH7ausehwE" opts={opts} />
            <LazyYouTube videoId="Z0fZ_GIT7vo" opts={opts} />
            <LazyYouTube videoId="O0VFTXkXcAE" opts={opts} />
            <LazyYouTube videoId="YG1sW00jwLY" opts={opts} />
            <LazyYouTube videoId="F6Nh1l-T1qY" opts={opts} />
            <LazyYouTube videoId="JJjBPBWaeYU" opts={opts} />
            <LazyYouTube videoId="THV25A4kIr0" opts={opts} />
            <LazyYouTube videoId="VTLCoHnyACE" opts={opts} />
            <LazyYouTube videoId="KnBwHYAnbEw" opts={opts} />
            <LazyYouTube videoId="qrbf9DtR3_c" opts={opts} />
            <LazyYouTube videoId="AEKBlW81SAc" opts={opts} />
            <LazyYouTube videoId="2MCmnr2L50o" opts={opts} />
            <LazyYouTube videoId="LfaMVlDaQ24" opts={opts} />
            </div>
        </div>
    );
}