/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React,{useEffect, useRef} from 'react'
import './VideoPlayer.css'
import { list } from 'postcss'
import { Client, Storage } from "appwrite";

let buckets = ["6607cc2d924c0566ab3c","6607abafd5107e2a1284","6607d61090ed1f9d10af"]

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6607ab95320ce1e59ad3') // Your project ID
;

const storage = new Storage(client);

function VideoPlayer({sub,creditsTime}) {
    const playPauseBtn = useRef('play-pause-btn')
    const theaterBtn = useRef('theater-btn')
    const fullScreenBtn = useRef('full-screen-btn')
    const miniPlayerBtn = useRef('mini-player-btn')
    const video = useRef('main-video')
    const videoContainer = useRef('video-container')
    const volumeSlider = useRef('volume-slider')
    const muteBtn = useRef('mute-btn')
    const currentTimeElem = useRef('current-time')
    const totalTimeElem = useRef('total-time')
    const speedBtn = useRef('speed-btn')
    const previewImg = useRef('preview-img')
    const thumbnailImg = useRef('thumbnail-img')
    const timelineContainer = useRef('timeline-container')
    const r = document.querySelector(':root')
    
    const [volumeLevel, setVolumeLevel] = React.useState('high')
    const [volumeValue, setVolumeValue] = React.useState(1)
    const [totalTimeVar, setTotalTimeVar] = React.useState(null)
    const [currentTimeVar, setCurrentTimeVar] = React.useState("0:00")
    const [leftArrowStyle, setLeftArrowStyle] = React.useState(false)
    const [rightArrowStyle, setRightArrowStyle] = React.useState(false)
    const [quality, setQuality] = React.useState('720p')
    const [speed, setSpeed] = React.useState(1)
    const [ctm, setCtm] = React.useState(0)
    const [videoSRC, setVideoSRC] = React.useState()
    const [settingsOpen, setSettingsOpen] = React.useState(false)
    const [speedOpen, setSpeedOpen] = React.useState(false)
    const [th, setTh] = React.useState(false)
    const [subbed, setSubbed] = React.useState(sub)
    const [startTime, setStartTime] = React.useState(0)
    const [isloading, setIsLoading] = React.useState(true)

    let qualityChange = false
    
    const[files,setFiles] = React.useState()

    async function listFiles(id){
      try {
          const result = await storage.listFiles(id);
          setFiles(result.files)
      } catch (error) {
          console.log(error);
      }
    }

    useEffect(()=>{
      listFiles("6607cc2d924c0566ab3c")
    },[])

    useEffect(()=>{
      if(files){
        setVideoSRC(storage.getFileView("6607cc2d924c0566ab3c",files[0].$id).href)
        video.current.poster = storage.getFilePreview("6607cc2d924c0566ab3c",files[4].$id).href
      }
    },[files])

    document.addEventListener("click",()=>{
      setSettingsOpen(false)
      setSpeedOpen(false)
    })

    function togglePlay() {
        if(!video.current){
            return
        }
        video.current.paused ? video.current.play() : video.current.pause()
    }

    const autoplayfunc = ()=>{
      setTimeout(()=>{
        if(video.current.paused){
          video.current.play()
        }
      },[1000])
    }
    function toggleTheaterMode(){
      setTh(!th)
      videoContainer.current.classList.toggle('theater')
    }
    function toggleFullScreenMode(){
      videoContainer.current.classList.toggle('full-screen')
      if(document.fullscreenElement){
        document.exitFullscreen()
      }else{
        videoContainer.current.requestFullscreen()
      }
    }
    function toggleMiniPlayerMode(){
      if(videoContainer.current.classList.contains('mini-player')){
        videoContainer.current.classList.remove('mini-player')
        document.exitPictureInPicture()
      }
      else{
        videoContainer.current.classList.add('mini-player')
        video.current.requestPictureInPicture()
      }
    }

    //volume
    function toggleMute(){
      setVolumeLevel(video.current.muted ? 'high' : 'muted')
      setVolumeValue(video.current.muted ? 1 : 0)
      video.current.muted = !video.current.muted
    }

    function handleVolumeInputChange(e){
      setVolumeValue(e.target.value)
      video.current.volume = e.target.value
      video.current.muted = e.target.value === '0'
    }

    function handleVolumeChange(e){
      if(video.current.muted || video.current.volume === 0){
        setVolumeValue(0)  
        setVolumeLevel('muted')
      }
      else if(video.current.volume >= 0.5){
        setVolumeLevel('high')
      }
      else{
        setVolumeLevel('low')
      }
      videoContainer.current.setAttribute('data-volume-level',volumeLevel)
    }

    //duration
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2})
    function formatDuration(time){
      const seconds = Math.floor(time % 60)
      const minutes = Math.floor(time / 60) % 60
      const hours = Math.floor(time / 3600)
      if(hours === 0){
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
      }
      else{
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
      }
    }

    function skipTimeFunc(val){
      const videoElem = document.getElementById('main-video')
      videoElem.currentTime = videoElem.currentTime + val
    }

    //playback speed
    function speedBtnClick(e){
      e.stopPropagation()
      setSpeedOpen(!speedOpen)
      setSettingsOpen(false)
    }
    function changePlaybackSpeed(s,sv){
      setSpeed(sv)
      console.log(s);
      video.current.playbackRate = s
    }

    //timeline
    function toggleShift(e){
      const rect = e.target.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width
      r.style.setProperty("--progress-position", percent)
      const newTime = percent * video.current.duration
      video.current.currentTime = newTime
      video.current.play()
    }
    
    function handleTimelineUpdate(e) {
      const rect = e.target.getBoundingClientRect()
      const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width
      const previewImgNumber = Math.max(
        1,
        Math.floor((percent * video.current.duration) / 10)
      )
      const previewImgSrc = `./previews/preview${previewImgNumber}.png`
      previewImg.current.src = previewImgSrc
      r.style.setProperty("--preview-position", percent)
    }
    
    //quality
    async function handleChangeQuality(q){
      setIsLoading(true)
      qualityChange = true
      setCtm(video.current.currentTime)
      console.log(ctm);
      setQuality(q)
      switch(quality){
        case "1080":
          setVideoSRC(storage.getFileView("6607cc2d924c0566ab3c",files[0].$id).href)
          break
        case "720":
          setVideoSRC(storage.getFileView("6607cc2d924c0566ab3c",files[1].$id).href)
          break
        case "480":
          setVideoSRC(storage.getFileView("6607cc2d924c0566ab3c",files[2].$id).href)
          break
        case "360":
          setVideoSRC(storage.getFileView("6607cc2d924c0566ab3c",files[3].$id).href)
          break
      }
    }
    document.addEventListener("keydown",e=>{
      const tagName = document.activeElement.tagName.toLowerCase()
      if(tagName === 'input' || tagName === 'textarea'){
        return
      }
        switch(e.key.toLowerCase()){
            case ' ':
                if(tagName === "button") return
                togglePlay()
                break
            case 'k':
                togglePlay()
                break
            case 'f':
                toggleFullScreenMode()
                break
            case 't':
                toggleTheaterMode()
                break
            case 'i':
                toggleMiniPlayerMode()
                break
        }
    })

    return (
      <div data-volume-level="high" ref={videoContainer} style={{marginInline:"auto"}} className={`flex justify-center items-center w-[90%] max-w-[1000px] relative overflow-hidden paused bg-black select-none ${videoSRC?"":" hidden"}`} id='video-container'>
          {subbed?(<div id='video-controls-container' className='absolute bottom-0 left-0 right-0 text-white z-[100] duration-200 bg-[rgba(0,0,0,0.7)]'>
              <div ref={thumbnailImg} className='thumbnail-img'></div>
              <div onMouseDown={toggleShift} onMouseMove={handleTimelineUpdate} ref={timelineContainer} className='timeline-container h-[7px] cursor-pointer flex'>
                <div className='timeline bg-[rgba(100,100,100,0.5)] h-[4px] w-full relative'>
                  <img ref={previewImg} className='preview-img'/>
                  <div className='thumb-indicator pointer-events-none'></div>
                </div>
              </div>
              <div className='flex gap-[0.5rem] items-center p-[10px]' id='controls'>
                  <button ref={playPauseBtn} onClick={togglePlay} id='play-pause-btn' className="">
                    <svg className='play-icon h-[24px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/></svg>
                    <svg className='pause-icon h-[24px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm224-72V328c0 13.3-10.7 24-24 24s-24-10.7-24-24V184c0-13.3 10.7-24 24-24s24 10.7 24 24zm112 0V328c0 13.3-10.7 24-24 24s-24-10.7-24-24V184c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>
                  </button>
                  <div className='volume-container flex justify-center items-center'>
                    <button onClick={toggleMute} ref={muteBtn} className='mute-btn mr-2'>
                      <svg className="volume-high-icon h-[28px]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                      </svg>
                      <svg className="volume-low-icon h-[28px]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                      </svg>
                      <svg className="volume-muted-icon h-[28px]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                      </svg>
                    </button>
                    <input onInput={handleVolumeInputChange} ref={volumeSlider} className='volume-slider cursor-pointer' type='range' min="0" max="1" step="any" value={volumeValue}/>
                  </div>
                  <div className='duration-container flex items-center gap-[0.25rem] flex-grow'>
                    <div ref={currentTimeElem} className='current-time'>{currentTimeVar}</div>
                    /
                    <div ref={totalTimeElem} className='total-time'>{totalTimeVar}</div>
                  </div>
                  <button ref={speedBtn} onClick={speedBtnClick} className='speed-btn wide-btn relative mr-[-20px]'>
                    <svg className={`h-[20px]`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64c0-17.4-6.9-33.1-18.1-44.6L366 161.7c5.3-12.1-.2-26.3-12.3-31.6s-26.3 .2-31.6 12.3L257.9 288c-.6 0-1.3 0-1.9 0c-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                    {speedOpen?(<div className='absolute top-0 left-0 translate-x-[calc(-50%+10px)] bg-[#2f2f2f] translate-y-[calc(-100%-20px)] w-[200px] flex justify-center items-start rounded-md'>
                      <ul className='flex flex-col items-start justify-center w-full rounded-md overflow-hidden'>
                        <li onClick={()=>{
                          changePlaybackSpeed("0.25",0.25)
                        }} className={`${speed === 0.25?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>0.25</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("0.5",0.5)
                        }} className={`${speed === 0.5?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>0.5</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("0.75",0.75)
                        }} className={`${speed === 0.75?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>0.75</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("1",1)
                        }} className={`${speed === 1?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>Normal</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("1.25",1.25)
                        }} className={`${speed === 1.25?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>1.25</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("1.5",1.5)
                        }} className={`${speed === 1.5?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>1.5</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("1.75",1.75)
                        }} className={`${speed === 1.75?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>1.75</li>
                        <li onClick={()=>{
                          changePlaybackSpeed("2",2)
                        }} className={`${speed === 2?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-start pl-4 pt-5 pb-5 items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>2.0</li>
                      </ul>
                    </div>):null}
                  </button>
                  <button className='relative' onClick={(e)=>{
                    e.stopPropagation()
                    setSettingsOpen(!settingsOpen)
                    setSpeedOpen(false)
                  }}>
                    <svg className={`h-[20px] ${settingsOpen?" rotate-45":" rotate-0"} duration-200`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                    {settingsOpen?(<div className='absolute top-0 left-0 translate-x-[calc(-50%+10px)] bg-[#2f2f2f] translate-y-[calc(-100%-20px)] w-[100px] flex justify-center items-center rounded-md'>
                      <ul className='flex flex-col items-start justify-center w-full rounded-md overflow-hidden'>
                        <li onClick={()=>{handleChangeQuality("1080")}} className={`${quality === "1080"?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-center items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>1080p</li>
                        <li onClick={()=>{handleChangeQuality("720")}} className={`${quality === "720"?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-center items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>720p</li>
                        <li onClick={()=>{handleChangeQuality("480")}} className={`${quality === "480"?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-center items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>480p</li>
                        <li onClick={()=>{handleChangeQuality("360")}} className={`${quality === "360"?"bg-[rgba(100,100,100,0.8)]":""} h-[30px] flex justify-center items-center hover:bg-[rgba(100,100,100,1)] w-full p-0`}>360p</li>
                      </ul>
                    </div>):null}
                  </button>
                  <button ref={miniPlayerBtn} onClick={toggleMiniPlayerMode} id='mini-player-btn'> 
                  <svg className='h-[23px] hover:scale-105 duration-150' viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
                  </svg>
                  </button>
                  <button ref={theaterBtn} onClick={toggleTheaterMode} id='theater-btn'>
                  <svg className="tall h-[30px] hover:scale-105 duration-150" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                  </svg>
                  <svg className="wide h-[30px]" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                  </svg>
                  </button>
                  <button ref={fullScreenBtn} onClick={toggleFullScreenMode} className='hover:scale-105 duration-150' id='fullscreen-btn'>
                  <svg className="open" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                  <svg className="close" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
                  </button>
              </div>
          </div>):null}
          <video ref={video} onClick={togglePlay} onPlay={()=>{
            setIsLoading(false)
            videoContainer.current.classList.remove('paused')
          }} onPause={()=>{
            videoContainer.current.classList.add('paused')
          }} onVolumeChange={handleVolumeChange} onLoadedData={(e)=>{
            if(!subbed){
              e.target.currentTime = Math.floor(Math.random() * video.current.duration-creditsTime-30)
              console.log(e.target.currentTime)
              setStartTime(e.target.currentTime)
            }
            else{
              e.target.currentTime = ctm
            }
            setTotalTimeVar(formatDuration(video.current.duration))
            e.target.play()
            autoplayfunc()
            setIsLoading(false)
          }} onTimeUpdate={(e)=>{
            // console.log(video.current.currentTime,startTime)
            if(!subbed){
              if(video.current.currentTime >= 30+startTime || video.current.currentTime < startTime){
                video.current.currentTime = 30+startTime
                video.current.pause()
              }
            }
            setCurrentTimeVar(formatDuration(video.current.currentTime)) 
            const percent = (video.current.currentTime / video.current.duration)
            r.style.setProperty("--progress-position",percent)       
          }} id="main-video" className={`${th?"h-[90vh]":"w-full"} h-full object-cover`} src={videoSRC}>
          </video>
          <div id='overlaydiv' className='absolute w-full flex justify-around items-center opacity-0 pointer-events-none'>
            {subbed?(<button onClick={()=>{
              skipTimeFunc(-5)
            }} onMouseDown={()=>{
              setLeftArrowStyle(true)
            }} onMouseUp={()=>{
              setLeftArrowStyle(false)
            }}>
            <svg className={`z-[100] h-[50px] ${leftArrowStyle?"translate-x-[-15px]":"translate-x-0"} duration-200 hover:scale-110 ${isloading?"hidden":""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>):null}
            <button ref={playPauseBtn} onClick={togglePlay} id='play-pause-btn' className=" hover:scale-110 duration-200">
                    <svg className={`play-icon h-[50px] ${isloading?"hidden":""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/></svg>
                    <svg className={`pause-icon h-[50px] ${isloading?"hidden":""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm224-72V328c0 13.3-10.7 24-24 24s-24-10.7-24-24V184c0-13.3 10.7-24 24-24s24 10.7 24 24zm112 0V328c0 13.3-10.7 24-24 24s-24-10.7-24-24V184c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>
                  </button>
            {subbed?(<button onClick={()=>{
              skipTimeFunc(5)
            }} onMouseDown={()=>{
              setRightArrowStyle(true)
            }} onMouseUp={()=>{
              setRightArrowStyle(false)
            }}>
            <svg className={`z-[100] h-[50px] ${rightArrowStyle?"translate-x-[15px]":"translate-x-0"} duration-200 hover:scale-110 ${isloading?"hidden":""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ffffff" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
            </button>):null}
          </div>
      </div>
    )
}

export default VideoPlayer