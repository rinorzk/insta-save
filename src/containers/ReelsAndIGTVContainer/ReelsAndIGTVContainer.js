import React from "react";
import FixedAd from "../../components/FixedAd/FixedAd";
import PhoneCard from "../../components/PhoneCard/PhoneCard";

function ReelsAndIGTVContainer(props) {
  const { post } = props;

  console.log(post);

  return (
    <div>
      <FixedAd />
      <PhoneCard
        video={post.video_url}
        id={post.id}
        comments={post.comments}
        likes={post.likes}
        caption={post.caption}
        profilePic={post.profile_pic}
        username={post.username}
      />
    </div>
  );
}

export default ReelsAndIGTVContainer;
