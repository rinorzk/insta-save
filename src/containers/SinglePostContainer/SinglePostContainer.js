import React from "react";

import SinglePostCard from "../../components/SinglePostCard/SinglePostCard";
import FixedAd from '../../components/FixedAd/FixedAd'

import classes from "./SinglePostContainer.module.scss";

function SinglePostContainer(props) {
  
  return (
    <div>
      <div>
        <FixedAd />
      </div>
      <SinglePostCard
        image={props.image}
        is_video={props.is_video}
        video={props.video}
        username={props.username}
        profilePic={props.profilePic}
        likes={props.likes}
        comments={props.comments}
        caption={props.caption}
        id={props.id}
      />
      <div>
        <FixedAd />
      </div>
    </div>
  );
}

export default SinglePostContainer;
