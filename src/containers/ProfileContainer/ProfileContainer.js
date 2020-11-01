import React, { useEffect, useState } from "react";
import request from "request-promise";
import cheerio from "cheerio";

import classes from "./ProfileContainer.module.scss";
import config from "../../config";
import ProfilePostCard from "../../components/ProfilePostCard/ProfilePostCard";
import FixedAd from "../../components/FixedAd/FixedAd";

function ProfileContainer(props) {
  const [usernameFeed, setUsernameFeed] = useState([]);

  useEffect(() => {
    if(props.edges) {
      getUsernameFeed();
    }
  }, []);

  const getUsernameFeed = async () => {

    let posts = [];
    let numberOfSLides = 0;

    for (let edge of props.edges) {
      try {
        let { node } = edge;

        switch (node.__typename) {
          case "GraphImage":
            posts = [
              ...posts,
              {
                id: node.id,
                mediaType: node.__typename,
                thumbnail: node.thumbnail_src,
                display_url: node.display_url,
                nr_likes: node.edge_liked_by.count,
                nr_comments: node.edge_media_to_comment.count,
                caption: node.edge_media_to_caption.edges[0].node.text,
                sliderNumber: null,
                profile_pic: props.profilePic,
              },
            ];
            break;
          case "GraphVideo":
            posts = [
              ...posts,
              {
                id: node.id,
                mediaType: node.__typename,
                thumbnail: node.thumbnail_src,
                display_url: node.video_url,
                nr_likes: node.edge_liked_by.count,
                nr_comments: node.edge_media_to_comment.count,
                caption: node.edge_media_to_caption.edges[0].node.text,
                sliderNumber: null,
                profile_pic: props.profilePic,
              },
            ];
            break;
          case "GraphSidecar":
            posts = [
              ...posts,
              {
                id: node.id,
                mediaType: node.__typename,
                thumbnail: node.thumbnail_src,
                display_url: node.edge_sidecar_to_children,
                nr_likes: node.edge_liked_by.count,
                nr_comments: node.edge_media_to_comment.count,
                caption: node.edge_media_to_caption.edges[0].node.text,
                sliderNumber: numberOfSLides,
                profile_pic: props.profilePic,
              },
            ];
            numberOfSLides = numberOfSLides + 1;
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error, "error");
      }
    }

    setUsernameFeed(posts);
  };

  return (
    <div className={classes.wrapper}>
      <FixedAd />
      {props.error && <p className={classes.error}>{props.error}</p>}
      <div className={classes.container}>
        {usernameFeed.length > 0
          ? usernameFeed.map((post) => {
              return (<ProfilePostCard
                key={post.id}
                src={post.thumbnail}
                mediaType={post.mediaType}
                display_url={post.display_url}
                nr_likes={post.nr_likes}
                nr_comments={post.nr_comments}
                caption={post.caption}
                sliderNumber={post.sliderNumber}
                profilePic={post.profile_pic}
                isSearched={props.isSearched}
                username={props.isSearched ? props.username : config.profileUsername}
                id={post.id}
              />);
            })
          : null}
      </div>
      <FixedAd />
    </div>
  );
}

export default ProfileContainer;
