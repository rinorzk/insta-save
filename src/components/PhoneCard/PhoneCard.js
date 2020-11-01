import React, { useState } from "react";

import classes from "./PhoneCard.module.scss";
import playLogo from "../../assets/play.svg";
import pauseLogo from "../../assets/pause.svg";
import heart from "../../assets/feather-heart.svg";
import comment from "../../assets/feather-message-circle.svg";
import SkeletonComments from "../SkeletonComments/SkeletonComments";
import DownloadButton from "../DownloadButton/DownloadButton";
import FixedAd from "../FixedAd/FixedAd";

function PhoneCard(props) {
  const [playing, setPlaying] = useState(false);
  const [showingButtons, setShowingButtons] = useState(true);
  console.log("Video url", props.video);

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function shortNumberHandler(number) {
    var tier = (Math.log10(number) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  }

  const showPausePlay = () => {
    setPlaying(!playing);
  };

  return (
    <div className={classes.container}>
      <div className={classes.mediaHolder}>
        <div
          className={classes.playLogoHolder}
          style={{ display: showingButtons ? "flex" : "none" }}
        >
          {playing ? <img src={pauseLogo} /> : <img src={playLogo} />}
        </div>
        <div className={classes.profilePicOnMobile}>
          <div className={classes.profilePicHolderPhone}>
            <div className={classes.profilePicWrapperPhone}>
              <img src={props.profilePic} />
            </div>
          </div>
          <p>{props.username}</p>
        </div>
        <video
          key={props.video}
          width="320"
          height="240"
          controls
          onClick={() => showPausePlay()}
          onMouseOver={() => setShowingButtons(true)}
          onMouseLeave={() =>
            !playing ? setShowingButtons(true) : setShowingButtons(false)
          }
        >
          <source src={props.video} type="video/mp4" />
        </video>
        <DownloadButton is_video={true} mediaURL={props.video} id={props.id} />
      </div>

      <div className={classes.postInfoHolder}>
        <div className={classes.likesHolder}>
          <div className={classes.usernameHolder}>
            <div className={classes.profilePicHolder}>
              <div className={classes.profilePicWrapper}>
                <img src={props.profilePic} />
              </div>
            </div>
            <p>{props.username}</p>
          </div>
          <div className={classes.postStats}>
            <div className={classes.singlePostStat}>
              <img src={heart} />
              <p>{shortNumberHandler(props.likes)}</p>
            </div>
            <div className={classes.singlePostStat}>
              <img src={comment} />
              <p>{shortNumberHandler(props.comments)}</p>
            </div>
          </div>
        </div>
        <div className={classes.captionHolder}>
          <p>{props.caption}</p>
        </div>
        <div>
          <SkeletonComments />
          <FixedAd />
        </div>
      </div>
    </div>
  );
}

export default PhoneCard;
