import React, { useState, useEffect, useRef } from "react";
import request from "request-promise";
import cheerio, { html } from "cheerio";

import SinglePostContainer from "../SinglePostContainer/SinglePostContainer";

import classes from "./FeedContainer.module.scss";
import AlbumContainer from "../AlbumContainer/AlbumContainer";
import ReelsAndIGTVContainer from "../ReelsAndIGTVContainer/ReelsAndIGTVContainer";
import SquareAd from "../../components/SquareAd/SquareAd";
import ProfileContainer from "../../containers/ProfileContainer/ProfileContainer";

function FeedContainer(props) {
  const { searchValue, postType } = props;

  useEffect(() => {
    // submit()
    callFn();
  }, []);

  function callFn() {
    var elements = document.getElementsByClassName("txt-rotate");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute("data-rotate");
      var period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
  }

  // FEEDS STATE
  const [singlePost, setSinglePost] = useState({});
  const [singleVideo, setSingleVideo] = useState({});
  const [albumPost, setAlbumPost] = useState([]);
  const [singleIGTV, setSingleIGTV] = useState({});
  const [singleReel, setSignleReel] = useState({});
  const [profile, setProfile] = useState({});
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");

  const [currentWord, setCurrentWord] = useState(0);

  var TxtRotate = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
  };

  TxtRotate.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
    // console.log(i);
    setCurrentWord(i);
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    var that = this;
    var delta = 300 - Math.random() * 100;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  // SENDING REQUESTS FOR EACH TYPE OF POST
  const renderPostFeed = async () => {
    // Send Request
    const BASE_URL = searchValue;

    let response = null;
    
    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
      setError("Sorry, this Link isn't available...")
      return
    }
    setError("");

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(JSON.parse(script_regex[1]));

    const postType = data.PostPage[0].graphql.shortcode_media.__typename;

    console.log("Data", data);

    console.log(data.PostPage[0].graphql.shortcode_media.__typename);

    switch (postType) {
      // Single Image
      case "GraphImage":
        console.log("Its a singe photo");
        props.changePostType("PostImage");

        let {
          PostPage: {
            [0]: {
              graphql: {
                shortcode_media: {
                  display_url: display_url,
                  id: post_id,
                  edge_media_preview_comment: comments,
                  edge_media_preview_like: likes,
                  edge_media_to_caption: caption,
                  owner: owner,
                },
              },
            },
          },
        } = data;

        console.log(caption);

        let image_post = {
          display_url: display_url,
          id: post_id,
          comments: comments.count,
          likes: likes.count,
          caption: caption.edges[0].node.text,
          profile_pic: owner.profile_pic_url,
          username: owner.username,
          is_video: false,
        };
        setSinglePost(image_post);
        console.log("Image Obj", image_post);

        break;
      // Single Video
      case "GraphVideo":
        console.log("Its a singe video");
        props.changePostType("PostVideo");

        let {
          PostPage: {
            [0]: {
              graphql: {
                shortcode_media: {
                  video_url: post_video_url,
                  id: video_id,
                  edge_media_preview_comment: video_comments,
                  edge_media_preview_like: video_likes,
                  edge_media_to_caption: video_caption,
                  owner: video_owner,
                },
              },
            },
          },
        } = data;

        let video_post = {
          video_url: post_video_url,
          id: video_id,
          comments: video_comments.count,
          likes: video_likes.count,
          caption: video_caption.edges[0].node.text,
          profile_pic: video_owner.profile_pic_url,
          username: video_owner.username,
        };
        // setSingleVideo(video_post);
        setSingleVideo({
          video_url: post_video_url,
          id: video_id,
          comments: video_comments.count,
          likes: video_likes.count,
          caption: video_caption.edges[0].node.text,
          profile_pic: video_owner.profile_pic_url,
          username: video_owner.username,
          is_video: true,
        });
        console.log(video_post);

        break;
      // Single Album
      case "GraphSidecar":
        console.log("Its an album");
        props.changePostType("PostAlbum");

        let album_posts = [];

        let {
          PostPage: {
            [0]: {
              graphql: {
                shortcode_media: {
                  edge_sidecar_to_children: album_children,
                  edge_media_preview_comment: album_comments,
                  edge_media_preview_like: album_likes,
                  edge_media_to_caption: album_caption,
                  owner: album_owner,
                },
              },
            },
          },
        } = data;

        console.log(album_children.edges);

        album_children.edges.map((child) => {
          let media_type = child.node.__typename;

          if (media_type === "GraphImage") {
            album_posts.push({
              id: child.node.id,
              display_url: child.node.display_url,
              comments: album_comments.count,
              likes: album_likes.count,
              caption: album_caption.edges[0].node.text,
              profile_pic: album_owner.profile_pic_url,
              username: album_owner.username,
              is_video: false,
            });
            console.log(album_posts);
          } else {
            album_posts.push({
              id: child.node.id,
              video_url: child.node.video_url,
              comments: album_comments.count,
              likes: album_likes.count,
              caption: album_caption.edges[0].node.text,
              profile_pic: album_owner.profile_pic_url,
              username: album_owner.username,
              is_video: true,
            });
            console.log("Video from album");
          }
        });

        setAlbumPost(album_posts);

        break;
      default:
        break;
    }
  };

  const renderProfileFeed = async () => {
    // Send Request
    const BASE_URL = `https://www.instagram.com/${searchValue}`;

    let response = null;
    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
      setError("Sorry, this Link isn't available...")
      return
    }
    setError("")

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(data);

    let {
      ProfilePage: {
        [0]: {
          graphql: {
            user: {
              full_name: profile_name,
              username: profile_username,
              profile_pic_url: profile_picture,
              edge_follow: profile_follows,
              edge_followed_by: profile_followers,
              edge_owner_to_timeline_media: profile_posts,
              edge_owner_to_timeline_media: { edges },
              is_private: is_private
            },
          },
        },
      },
    } = data;

    if(is_private) {
      setError("This Account is Private")
    } else {
      setError("");
    }

    setProfile({
      name: profile_name,
      username: profile_username,
      profile_pic: profile_picture,
      follow: profile_follows.count,
      followedBy: profile_followers.count,
      posts: profile_posts.count,
    });

    setEdges(edges);
    props.changePostType("Profile");
  };

  const renderStoryFeed = async () => {
    props.changePostType("Story");

    // Send Request

    const BASE_URL = searchValue;

    let response = null;

    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
      setError("Sorry, this Link isn't available...")
      return
    }
    setError("")

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(data);
  };

  const renderIgTVFeed = async () => {
    // Send Request
    const BASE_URL = searchValue;

    let response = null;

    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
      setError("Sorry, this Link isn't available...")
      return;
    }
    setError("")

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(JSON.parse(script_regex[1]));

    let {
      PostPage: {
        [0]: {
          graphql: {
            shortcode_media: {
              video_url: video_url,
              id: igtv_id,
              edge_media_preview_comment: igtv_comments,
              edge_media_preview_like: igtv_likes,
              title: igtv_caption,
              owner: igtv_owner,
            },
          },
        },
      },
    } = data;

    let igtv_post = {
      video_url: video_url,
      id: igtv_id,
      comments: igtv_comments.count,
      likes: igtv_likes.count,
      caption: igtv_caption,
      profile_pic: igtv_owner.profile_pic_url,
      username: igtv_owner.username,
    };

    setSingleIGTV(igtv_post);

    console.log(singleIGTV);
    props.changePostType("IGTV");
  };

  const renderReelFeed = async () => {
    // Send Request

    const BASE_URL = searchValue;

    let response = null;

    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
      setError("Sorry, this Link isn't available...")
      return
    }
    setError("")

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(JSON.parse(script_regex[1]));

    let {
      PostPage: {
        [0]: {
          graphql: {
            shortcode_media: {
              video_url: video_url,
              id: reel_id,
              edge_media_preview_comment: reel_comments,
              edge_media_preview_like: reel_likes,
              edge_media_to_caption: reel_caption,
              owner: reel_owner,
            },
          },
        },
      },
    } = data;

    let reel_post = {
      video_url: video_url,
      id: reel_id,
      comments: reel_comments.count,
      likes: reel_likes.count,
      caption: reel_caption.edges[0].node.text,
      profile_pic: reel_owner.profile_pic_url,
      username: reel_owner.username,
    };

    setSignleReel(reel_post);

    props.changePostType("Reel");
  };

  // SUBMIT THE LINK AND CALL REQUEST
  const submit = () => {
    if (!searchValue) return;
    switch (searchValue.substring(0, 27)) {
      // POST
      case "https://www.instagram.com/p":
        renderPostFeed();
        break;
      // STORY
      case "https://www.instagram.com/s":
        renderStoryFeed();
        break;
      // IGTV
      case "https://www.instagram.com/t":
        renderIgTVFeed();
        break;
      // REEL
      case "https://www.instagram.com/r":
        renderReelFeed();
        break;
      // PROFILE
      default:
        renderProfileFeed();
        break;
    }
    props.changeInputValue("");
  };

  // RENDER CONTENT BASED ON FEED TYPE
  const renderFeedType = () => {
    switch (postType) {
      case "PostImage":
        return (
          <SinglePostContainer
            is_video={singlePost.is_video}
            image={singlePost.display_url}
            username={singlePost.username}
            profilePic={singlePost.profile_pic}
            likes={singlePost.likes}
            comments={singlePost.comments}
            caption={singlePost.caption}
            id={singlePost.id}
          />
        );
      case "PostVideo":
        return (
          <SinglePostContainer
            is_video={singleVideo.is_video}
            video={singleVideo.video_url}
            username={singleVideo.username}
            profilePic={singleVideo.profile_pic}
            likes={singleVideo.likes}
            comments={singleVideo.comments}
            caption={singleVideo.caption}
            id={singleVideo.id}
          />
        );
      case "PostAlbum":
        return <AlbumContainer posts={albumPost} />;
      case "Profile":
        return (
          <ProfileContainer
            edges={edges}
            profilePic={profile.profile_pic}
            isSearched={true}
            error={error}
            username={profile.username}
          />
        );
      case "Story":
        return <p>This is a story</p>;
      case "IGTV":
        return <ReelsAndIGTVContainer post={singleIGTV} />;
      case "Reel":
        return <ReelsAndIGTVContainer post={singleReel} />;
      default:
        return;
    }
  };

  const setWordColorHandler = () => {
    switch (currentWord) {
      case 0:
        return "#E1306C";
      case 1:
        return "#5B51D8";
      case 2:
        return "#F56040";
      case 3:
        return "#405DE6";
      case 4:
        return "#FD1D1D";
      default:
        return "#E1306C";
    }
  };

  return (
    <div className={classes.container}>
      <div
        className={
          postType == "" ? classes.defaultInput : classes.inputWithContent
        }
      >
        <p style={{ fontSize: "32px" }}>
          Download Instagram
          <br />{" "}
          <span
            style={{ fontSize: "32px", color: setWordColorHandler() }}
            id="word"
            className="txt-rotate"
            data-rotate='[ "Photos", "Videos", "Albums", "IGTV", "Reels" ]'
          ></span>
        </p>
        <div
          className={classes.inputHolder}
          style={{ marginBottom: postType == "" ? "40px" : "30px" }}
        >
          <input
            value={searchValue}
            onChange={(e) => props.changeInputValue(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? submit() : null)}
            className={classes.input}
            placeholder="Paste link..."
            ref={props.inputRef}
          />
          <button className={classes.submitButton} onClick={submit}>
            Search
          </button>
        </div>
        {error && postType !== "Profile" && <p className={classes.errorText}>{error}</p>}
        {postType ? null : <SquareAd />}
      </div>
      <div>{renderFeedType()}</div>
    </div>
  );
}

export default React.memo(FeedContainer);
