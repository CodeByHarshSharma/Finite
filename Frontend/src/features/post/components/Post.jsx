import { useState } from "react";
import 'remixicon/fonts/remixicon.css'
import Comments from "./Comments.jsx";
import timeAgo from "../utils/timeAgo.js";



const Post = ({ user, post, handleLike, handleUnLike, currentUserId }) => {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0)
    const [showComments, setShowComments] = useState(false)
    const [commentCount, setCommentCount] = useState(post.commentCount || 0)

    const handleLikeButton = async () => {
        if (isLiked) {
            await handleUnLike(post._id);
            setIsLiked(false);
            setLikeCount(prev => prev - 1)
        } else {
            await handleLike(post._id);
            setIsLiked(true);
            setLikeCount(prev => prev + 1)
        }
    };
    const isText = post.type === 'text'

    return (
        <article className={isText ? "post post--text" : "post"}>
            <div className="user">
                <div className="img-wrapper">
                    <img src={user.profileImage} alt={user.username} />
                </div>
                <div className="user-meta">
                    <p>{user.username}</p>
                    {post.createdAt && <span className="timestamp">{timeAgo(post.createdAt)}</span>}
                </div>
                {post.category && post.category !== 'general' && (
                    <span className="category-tag">{post.category}</span>
                )}
            </div>

            {isText ? (
                <div className="text-post-body">
                    <p>{post.content}</p>
                </div>
            ) : (
                <img src={post.imgUrl} alt={post.caption || "Post"} loading="lazy" />
            )}

            <div className="icons">
                <div className="left">
                    <button onClick={handleLikeButton} aria-label="Like post" >
                        <i className={isLiked ? "ri-heart-fill like" : "ri-heart-line"}></i>
                    </button>
                    <button onClick={() => setShowComments(prev => !prev)}
                        aria-label={showComments ? "Hide Comments" : "Show Comments"}
                        aria-expanded={showComments}
                        aria-controls={`comments-${post._id}`}>
                        <i className={showComments ? "ri-chat-3-fill" : "ri-chat-3-line"}></i>
                    </button>
                </div>
                <div className="right">
                    <button onClick={() => setIsSaved(!isSaved)} aria-label="Save post" >
                        <i className={isSaved ? "ri-bookmark-fill" : "ri-bookmark-line"} ></i>
                    </button>
                </div>
            </div>

            <div className="like-count">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
                {commentCount > 0 && (
                    <button className="comment-count-link" onClick={() => setShowComments(prev => !prev)}>
                        {showComments ? 'Hide Comments' : `View ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
                    </button>
                )}
            </div>

            {!isText && (
                <div className="bottom">
                    <p className="caption">
                        {post.caption}
                    </p>
                </div>
            )}

            {showComments && (
                <div id={`comments-${post._id}`}>
                    <Comments
                        postId={post._id} 
                        currentUserId={currentUserId} 
                        onCountChange={setCommentCount} />
                </div>
            )}

        </article>
    );
};

export default Post;