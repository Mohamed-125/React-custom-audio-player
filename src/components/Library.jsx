import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Library.css";
import audioData from "../assets/data";
const Library = ({ library, setLibrary, setCounter }) => {
  // ref that we will work with
  const libraryDivRef = useRef();
  const largeScreenLibraryButton = useRef();
  const libraryButton = useRef();
  const [clicked, setClicked] = useState(false);

  // to keep the library closed when the user get into the website
  useLayoutEffect(() => {
    libraryDivRef.current.style.transform = `translate(-150vw)`;
  }, [libraryDivRef?.current?.loadedmetadata]);

  // to open and close the library
  useEffect(() => {
    library
      ? (libraryDivRef.current.style.transform = `translate(0vw)`)
      : (libraryDivRef.current.style.transform = `translate(-150vw)`);
    library
      ? (largeScreenLibraryButton.current.style.display = "none")
      : (largeScreenLibraryButton.current.style.display = "block");

    library && (libraryButton.current.style.display = "block");
  }, [clicked, library]);

  // to change the counter to the choosen song and to close the library after click
  const libraryItemClickHandler = (dataItem) => {
    setCounter(audioData.indexOf(dataItem));
    setLibrary((pre) => !pre);
    console.log(library);
  };
  return (
    <>
      <button
        ref={largeScreenLibraryButton}
        className="player__library-large-screens"
        onClick={() => {
          setLibrary((pre) => !pre);
          setClicked((pre) => !pre);
        }}
      >
        library
      </button>
      <div ref={libraryDivRef} className="library__div">
        <button
          ref={libraryButton}
          className="player__library"
          onClick={() => {
            setLibrary((pre) => !pre);
            setClicked((pre) => !pre);
          }}
        >
          library
        </button>
        {audioData.map((dataItem) => (
          <div
            onClick={() => {
              libraryItemClickHandler(dataItem);
            }}
            className="library__item"
          >
            <img src={dataItem.img} alt="song" className="library__item_img" />
            <div
              style={{
                position: "relative",
                top: "-0.5rem",

                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h3>{dataItem.name}</h3>
              <p>{dataItem.from}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Library;
