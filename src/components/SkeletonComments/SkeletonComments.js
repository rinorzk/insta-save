import React from 'react'

import classes from './SkeletonComments.module.scss'

function SkeletonComments() {
  return (
    <div className={classes.container}>
      <div className={classes.comment}>
        <div className={classes.user}>
          <div className={classes.profilePic}></div>
          <div className={classes.username}></div>
        </div>
        <div className={classes.commentText}>
          <div className={classes.commentFirstLine}></div>
          <div className={classes.commentSecondLine} style={{ width: "50%" }}></div>
        </div>
      </div>

      <div className={classes.comment}>
        <div className={classes.user}>
          <div className={classes.profilePic}></div>
          <div className={classes.username}></div>
        </div>
        <div className={classes.commentText}>
          <div className={classes.commentFirstLine}></div>
          <div className={classes.commentSecondLine} style={{ width: "60%" }}></div>
        </div>
      </div>

      <div className={classes.comment}>
        <div className={classes.user}>
          <div className={classes.profilePic}></div>
          <div className={classes.username}></div>
        </div>
        <div className={classes.commentText}>
          <div className={classes.commentFirstLine}></div>
          <div className={classes.commentSecondLine} style={{ width: "45%" }}></div>
        </div>
      </div>

      <div className={classes.comment}>
        <div className={classes.user}>
          <div className={classes.profilePic}></div>
          <div className={classes.username}></div>
        </div>
        <div className={classes.commentText}>
          <div className={classes.commentFirstLine}></div>
          <div className={classes.commentSecondLine} style={{ width: "75%" }}></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonComments
