import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./MusicPlayerSlider.css";
import audioData from "../assets/data";
import { BsPlayFill, BsFillPauseFill } from "react-icons/bs";
import Library from "./Library";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

import { AiFillSound } from "react-icons/ai";
const MusicPlayerSlider = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState({});
  const [currentTime, setCurrentTime] = useState({});
  const [counter, setCounter] = useState(0);
  const [target, setTarget] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [isvolumeControls, setIsvolumeControls] = useState(false);
  const [volume, setVolume] = useState(1);
  const [library, setLibrary] = useState(false);
  const audioRef = useRef();
  const sliderRef = useRef();
  const volumeSliderRef = useRef();

  // to know the duration of the audio file
  const metaDataHandler = (e) => {
    sliderRef.current.max = Math.floor(audioRef.current.duration);
    setDuration({
      seconds: Math.floor(e.target.duration % 60),
      min: Math.floor(e.target.duration / 60),
    });
  };

  //to show and upadate the currentTime of the audio file
  // and to make the draggign working
  // go to the next song auto when the song end
  const currentTimeChangeHandler = (e) => {
    setCurrentTime({
      seconds: Math.floor(e.target.currentTime % 60),
      min: Math.floor(e.target.currentTime / 60),
    });

    // to move the thump with the background
    requestAnimationFrame(() => {
      sliderRef.current.style.setProperty(
        "--translate-value",
        `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`
      );
    });

    // the width of the background
    sliderRef.current.style.setProperty(
      "--width",
      `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`
    );

    // go to the next song auto when the song end
    if (audioRef.current.currentTime === audioRef.current.duration) {
      if (counter === audioData.length - 1) {
        setCounter(0);
      } else {
        setCounter(counter + 1);
      }
    }
  };

  // chagne the postion when click on the timeline

  const changePostionHandler = () => {
    audioRef.current.currentTime = sliderRef.current.value;
  };
  // useEffect to pause the song when the audio change
  useEffect(() => {
    setIsPlaying(false);
  }, [counter]);

  // to play or pause the audio on click and to change the button visable into the user
  const playPause = (e) => {
    switch (e.target.id) {
      case "play":
        setIsPlaying(true);
        audioRef.current.play();
        break;
      case "pause":
        setIsPlaying(false);
        audioRef.current.pause();
        break;

      default:
        break;
    }
  };

  // to rotate the image when the song is playing
  const rotateImgFunc = (e) => {
    console.log("fsfsd");
    if (isPlaying) {
      e.target.style.setProperty(
        "animation",
        `rotation ${30}s infinite linear`
      );
    } else {
    }
  };

  // useEffect to go to the next or the perv song

  useEffect(() => {
    switch (target) {
      case "next":
        if (counter === audioData.length - 1) {
          setCounter(0);
        } else {
          setCounter(counter + 1);
        }
        break;
      case "prev":
        if (counter === 0) {
          setCounter(audioData.length - 1);
        } else {
          setCounter(counter - 1);
        }

        break;

      default:
        break;
    }
  }, [clicked]);

  // nextOrPrevSong function
  const nextOrPrevSong = (e) => {
    setClicked(!clicked);
    setTarget(e.target.id);
  };

  // to control the volume

  const volumeHandler = () => {
    setIsvolumeControls((pre) => !pre);
  };

  const changeVolumeHandler = () => {
    setVolume(volumeSliderRef.current.value / 100);
    audioRef.current.volume = volume;

    volumeSliderRef.current.style.setProperty(
      "--volume-slider-width",
      `${volume * 100}%`
    );

    if (volumeSliderRef.current.value === "0") {
      audioRef.current.volume = 0;
      volumeSliderRef.current.style.setProperty("--volume-slider-width", `0%`);
    }
  };
  return (
    <div className=" flex__center music-player__main_wraper">
      <div className="slider__div">
        <Library
          setLibrary={setLibrary}
          setCounter={setCounter}
          library={library}
        />

        <img src={audioData[counter].img} onLoad={rotateImgFunc} />
        <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {audioData[counter].name}
        </h3>
        <p style={{ textAlign: "center", marginBottom: "0.1rem" }}>
          {audioData[counter].from}
        </p>
        <audio
          onLoadedMetadata={metaDataHandler}
          onTimeUpdate={currentTimeChangeHandler}
          src={audioData[counter].audio}
          ref={audioRef}
        ></audio>
        <input
          onTouchMove={changePostionHandler}
          onTouchStart={changePostionHandler}
          onChange={changePostionHandler}
          ref={sliderRef}
          className="player__slider"
          type="range"
          defaultValue={0}
        />
        <div className="times__div">
          <p>
            {!duration.min && "00:00"}
            {duration.min < 10 ? `0${duration.min}` : duration.min}:
            {duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds}
          </p>

          {!currentTime.seconds ? (
            <p> 00:00</p>
          ) : (
            <p>
              {currentTime.min < 10 ? `0${currentTime.min}` : currentTime.min}:
              {currentTime.seconds < 10
                ? `0${currentTime.seconds}`
                : currentTime.seconds}
            </p>
          )}
        </div>
        <div className="player__setting_wraper">
          <div className="player__pausePlayPrev">
            <MdOutlineKeyboardArrowLeft onClick={nextOrPrevSong} id="prev" />
            {!isPlaying ? (
              <BsPlayFill onClick={playPause} id="play" />
            ) : (
              <BsFillPauseFill onClick={playPause} id="pause" />
            )}
            <MdOutlineKeyboardArrowRight onClick={nextOrPrevSong} id="next" />
          </div>
          <AiFillSound
            style={{ position: "relative", top: " 0.09rem" }}
            onClick={volumeHandler}
          />

          <div
            style={{
              width: "80px",
              display: isvolumeControls ? "block" : "none",
            }}
          >
            <input
              className="volume__slider"
              ref={volumeSliderRef}
              onChange={changeVolumeHandler}
              onClick={changeVolumeHandler}
              onTouchMove={changeVolumeHandler}
              onTouchStart={changeVolumeHandler}
              type="range"
              defaultValue={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerSlider;
