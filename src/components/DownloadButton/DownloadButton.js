import React, { useState } from "react";

import classes from "./DownloadButton.module.scss";
import Arrow from '../../assets/down-arrow.png'
import DownloadBox from '../../assets/download-box.png'

function DownloadButton(props) {
  const [onHover, setOnHover] = useState(false)

  const downloadMedia = (is_video, picUrl, id) => {
    fetch(picUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            is_video ? `${id}.mp4` : `${id}.png`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadHandler = (is_video, picUrl) => {
    if(props.urlArray) {
      props.urlArray.map(post => {
        const { is_video, id, display_url } = post.node;

        downloadMedia(is_video, display_url, id)
      })
    }
    else {
      downloadMedia(is_video, picUrl, props.id)
    }
  }

  return (
    <button
      className={classes.downloadButton}
      onClick={() => downloadHandler(props.is_video, props.mediaURL)}
      onMouseOver={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <div className={classes.buttonWrapper}>
        <div className={classes.iconsHolder}>
          <img src={Arrow} style={{ marginBottom: onHover ? "0px" : "-3px" }} />
          <img src={DownloadBox} style={{ marginTop: onHover ? "1px" : "0px" }} />
        </div>
        <p>DOWNLOAD</p>
      </div>
    </button>
  );
}

export default DownloadButton;
