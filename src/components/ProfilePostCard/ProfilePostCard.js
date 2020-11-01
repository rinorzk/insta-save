import React, { useState } from "react";

import Modal from "../../UI/Modal/Modal";
import classes from "./ProfilePostCard.module.scss";
import Arrow from "../../assets/next.png";
import heart from "../../assets/feather-heart.svg";
import comment from "../../assets/feather-message-circle.svg";
import playLogo from "../../assets/play.svg";
import pauseLogo from "../../assets/pause.svg";
import albumLogo from "../../assets/paper (1).png";
import videoLogo from "../../assets/play.png";
import DownloadButton from "../DownloadButton/DownloadButton";

function ProfilePostCard(props) {
  const [openModal, setOpenModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloadPhoto, setDownloadPhoto] = useState("");
  const [downloadVideo, setDownloadVideo] = useState("");
  const [donwloadAlbum, setDownloadAlbum] = useState([]);

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function shortNumberHandler(number) {
    var tier = (Math.log10(number) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  }

  const prevSlideHandler = (slideNumber, sliderNumber) => {
    
    if (currentSlide > 0) {
      setCurrentSlide((prevState) => prevState - 1);
      const currentMedia = props.display_url.edges[currentSlide - 1];

      document.getElementById(currentMedia.node.id).style.marginLeft = "0%"
    } else {
    }
  };

  const nextSlideHandler = (slideNumber, sliderNumber) => {
    const currentMedia = props.display_url.edges[currentSlide];

    // console.log("numberofslider", sliderNumber);
    if (currentSlide < slideNumber - 1) {
      setCurrentSlide((prevState) => prevState + 1);

      document.getElementById(currentMedia.node.id).style.marginLeft = "-100%"
    } else {
    }
  };

  const renderMediaModal = (type) => {
    switch (props.mediaType) {
      case "GraphImage":
        // setDownloadPhoto(props.display_url)
        return (
          <div className={classes.modalHolder}>
            <img width="100%" src={props.display_url} key={props.display_url} />
          </div>
        );
      case "GraphVideo":
        // setDownloadVideo(props.display_url)
        return (
          // <div className={classes.modalHolder}>
          <video
            className={classes.video}
            width="100%"
            controls
            key={props.display_url}
          >
            <source src={props.display_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          // </div>
        );
        break;
      case "GraphSidecar":
        // setDownloadAlbum(props.display_url.edges)
        return (
          <div className={classes.graphSidecarHolder}>
            <div
              className={classes.arrow}
              style={{ display: currentSlide === 0 ? "none" : "flex" }}
              onClick={() =>
                prevSlideHandler(
                  props.display_url.edges.length,
                  props.sliderNumber
                )
              }
            >
              <img src={Arrow} />
            </div>
            {props.display_url.edges.map((slide, index) => {
              if (slide.node.is_video) {
                return (
                  <video
                    key={slide.node.id}
                    className={index}
                    width="100%"
                    controls
                    id={slide.node.id}
                  >
                    <source src={slide.node.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              } else {
                return (
                  <img
                    key={slide.node.id}
                    width="100%"
                    src={slide.node.display_url}
                    className={index}
                    id={slide.node.id}
                  />
                );
              }
            })}
            <div
              className={classes.arrow2}
              style={{
                display:
                  currentSlide === props.display_url.edges.length - 1
                    ? "none"
                    : "flex",
              }}
              onClick={() =>
                nextSlideHandler(
                  props.display_url.edges.length,
                  props.sliderNumber
                )
              }
            >
              <img src={Arrow} />
            </div>
            <div className={classes.dots}>
              {props.display_url.edges.map((slide, index) => {
                return (
                  <div
                    className={classes.singleDot}
                    key={slide.node.id}
                    style={{
                      backgroundColor:
                        index === currentSlide ? "#dadada" : "#858585",
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        );
      default:
        break;
    }
  };

  const closeModal = () => {
    setOpenModal(false);

    const videos = document.getElementsByTagName("video");

    for(let i = 0; i < videos.length; i++) {
      videos[i].pause();
    }
  }

  return (
    <>
      <Modal show={openModal} modalClosed={closeModal}>
        {renderMediaModal(props.mediaType)}
      </Modal>
      <div className={classes.container}>
        <div className={classes.mediaHolder} onClick={() => setOpenModal(true)}>
          {props.mediaType === "GraphSidecar" ? (
            <img className={classes.mediaLogo} src={albumLogo} />
          ) : null}
          {props.mediaType === "GraphVideo" ? (
            <img className={classes.mediaLogo} src={videoLogo} />
          ) : null}
          <img className={classes.mediaPhoto} src={props.src} />
          {props.isSearched && props.mediaType === "GraphImage" && (
            <DownloadButton
              is_video={false}
              mediaURL={props.display_url}
              id={props.id}
            />
          )}
          {props.isSearched && props.mediaType === "GraphVideo" && (
            <DownloadButton
              is_video={true}
              mediaURL={props.display_url}
              id={props.id}
            />
          )}
          {props.isSearched && props.mediaType === "GraphSidecar" && (
            <DownloadButton
              is_video={null}
              urlArray={props.display_url.edges}
              id={props.id}
            />
          )}
        </div>

        <div className={classes.postInfoHolder}>
          <div className={classes.likesHolder}>
            <div className={classes.usernameHolder}>
              <div className={classes.profilePicHolder}>
                <div className={classes.profilePicWrapper}>
                  <img src={props.profilePic} />
                </div>
              </div>
              <p className={classes.username}>{props.username}</p>
            </div>
            <div className={classes.postStats}>
              <div className={classes.singlePostStat}>
                <img src={heart} />
                <p>{shortNumberHandler(props.nr_likes)}</p>
              </div>
              <div className={classes.singlePostStat}>
                <img src={comment} />
                <p>{shortNumberHandler(props.nr_comments)}</p>
              </div>
            </div>
          </div>
          <div className={classes.captionHolder}>
            <p>{props.caption}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(ProfilePostCard);
