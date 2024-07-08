import React from 'react'

const Retweet = ({post}) => {
    console.log(post.user);
  return (
    <div className="retweet">
            <div className="retweet-user">
                <img src={post?.user?.profileImg} alt={`${post?.user?.username}'s profile`} />
                <span>{post?.user?.username} retweeted</span>
            </div>
            <div className="original-post">
                <div className="original-post-user">
                    <img src={post?.retweet?.user?.profileImg} alt={`${post?.retweet?.user?.username}'s profile`} />
                    <span>{post?.retweet?.user?.username}</span>
                </div>
                <div className="original-post-content">
                    {/* <p>{post.retweet.text}</p> */}
                    {/* {post.retweet.img && <img src={post.retweet.img} alt="Post content" />} */}
                </div>
                <div className="post-actions">
                    {/* Add actions like like, comment, etc. */}
                </div>
            </div>
        </div>
  )
}

export default Retweet