import React from "react";

import classes from "./AlbumContainer.module.scss";
import AlbumPostCard from "../../components/AlbumPostCard/AlbumPostCard";
import FixedAd from "../../components/FixedAd/FixedAd";

function AlbumContainer(props) {
  return (
    <div>
      <div>
        <FixedAd />
      </div>
      <div className={classes.container}>
        {props.posts.length > 0
          ? props.posts.map((post) => (
              <AlbumPostCard
                key={post.id}
                image={post.display_url}
                is_video={post.is_video}
                video={post.video_url}
                username={post.username}
                profilePic={post.profile_pic}
                likes={post.likes}
                comments={post.comments}
                caption={post.caption}
                id={post.id}
              />
            ))
          : null}
      </div>
      <div>
        <FixedAd />
      </div>
    </div>
  );
}

export default AlbumContainer;
