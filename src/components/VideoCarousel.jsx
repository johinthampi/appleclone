import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../contants'
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setvideo] = useState({
        isEnd: false,
        startPlay: false,
        isLastVideo: false,
        isPlaying: false,
        videoId: 0
    })

    const [loadedData, setLoadedData] = useState([])
    //we extracted video using destructing instead of "video."
  const { isEnd, isLastVideo, isPlaying, videoId, startPlay } = video;
  //for the animation for slider to work with video
  useGSAP(() => {
    gsap.to('#slider', {
      //showing the new video
      //check obsidian
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      //ease- how the animation will work for slider that u get DOC of gsap
      ease:'power2.inOut'
    })
    gsap.to('#video', {
      // for this scrollTrigger we need to import import { ScrollTrigger } from 'gsap/all';
      //gsap.registerPlugin(ScrollTrigger);
      scrollTrigger: {
        trigger: '#video',
        toggleActions:'restart none none none'
      },
      onComplete: () => {
        setvideo((pre) => ({
          ...pre,startPlay:true,isPlaying:true,
        }))
      }
     })
   },[isEnd,videoId])
    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            }
      
      else {
          startPlay && videoRef.current[videoId].play()
            }
        }
    
    }, [startPlay, videoId, isPlaying, loadedData])
  const handleLoadedMetadata = (i, e) => setLoadedData
  ((pre)=>[...pre,e])
    

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      //animate the progress of the video carousel
      let anim = gsap.to(span[videoId], {
        // get the progress of the video
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 760 ? '10vw'
                :window.innerWidth<1200?'10vw':"4vw"
            })
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor:'white'
            })
          }
        },
                // if it working video the animation stop and restart 
        onComplete: () => {
          if (isPlaying) {
                  //for modifing the width video loading animation
            gsap.to(videoDivRef.current[videoId], {
              width:"12px"
            })
            //quick start and end for video animation
            gsap.to(span[videoId], {
              backgroundColor:"#afafaf"
            })
         }    
        }
      })
      //reset the button to after completing the video,is part of gsap restart()
      if (videoId === 0) {
        anim.restart()
      }
      //how long the animation last
      //update the progress bar
      //dividing the 2 times will give progress
      //currentTime-when the video run slider should also work according to video for ease out in slider GSAP
      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime/hightlightsSlides[videoId].videoDuration)
      }
      if (isPlaying) {
        //ticker is used for updating progress bar
        gsap.ticker.add(animUpdate)
      }
      else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate)
      }
      return () => {
        gsap.ticker.remove(animUpdate);
      };
    }
        
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        // vd id is the id for every video until id becomes number 3
        //pre-preVideo is shortform
        setvideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }))
        break;
      case "video-last":
        setvideo((pre) => ({ ...pre, isLastVideo: true }))
        break;
      case "video-reset":
        setvideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }))
        break;
      case "play":
        setvideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying}))
        break;
      //this used to pause the button of slider side button
        case "pause":
          setvideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying}))
          break;
      default:
        return video;
    }
  }
return (
  <>
    {/* desize of the slider of video */}
    <div className="flex items-center">
      {hightlightsSlides.map((list, i) => (
        <div key={list.id} id="slider" className="sm:pr-20 pr-10">
          <div className="video-carousel_container">
            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
              <video
                id="video"
                playsInline={true}
                preload="auto"
                muted
                ref={(el) => (videoRef.current[i] = el)}
                //for adding animation of video when it ends 
                onEnded={() => 
                  //index is not equal 3 so video is not ended
                  i !== 3 
                    //end video and index help in identifying which one video ended
                    ? handleProcess("video-end", i)
                    //if not we called video last so we know to restart
                    : handleProcess("video-last")
                  //after this step video button are full loaded and video not playing we go to top gsap call #slider
                }
                onPlay={() => {
                  setvideo((prevVideo) => ({
                    ...prevVideo,
                    isPlaying: true,
                  }));
                }}
                onLoadedMetadata={(e)=> handleLoadedMetadata(i,e)}
                src={list.video}
                type="video/mp4"
              ></video>
            </div>
            {/* getting image in the top the picture */}
            <div className="absolute top-12 left-[5%] z-10">
              {list.textLists.map((text) => (
                <p key={text} className="md:text-2xl text-xl font-medium">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* carousel pill button  */}
    <div className='relative flex-center mt-10 '>
      <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
        {videoRef.current.map((_, i) => (
          <span key={i} ref={(el) => (videoDivRef.current[i] = el)} className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'>
            <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[i] = el)} />
          </span>
            
        ))}
      </div>
      <button className='control-btn'>
        <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
          alt={isLastVideo ? 'replay' : !isPlaying ? "play" : "pause"}
          onClick={isLastVideo ? () => handleProcess("video-reset")
            : !isPlaying ? () => handleProcess("play")
              : () => handleProcess("pause")
          } />
      </button>
              
    </div>
  </>
);
};

export default VideoCarousel