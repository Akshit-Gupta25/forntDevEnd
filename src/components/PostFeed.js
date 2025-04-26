import React, { useState } from 'react';
import './PostFeed.css';

const PostFeed = ({ posts, currentUser }) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handleCommentSubmit = (postId, event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      profilePic: currentUser.profilePic,
      content: commentText,
      timestamp: new Date().toISOString()
    };

    // Update the post's comments
    const updatedPost = posts.find(post => post.id === postId);
    if (updatedPost) {
      updatedPost.comments = [...updatedPost.comments, newComment];
    }

    setCommentText('');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="post-feed">
        <div className="post-card empty-feed">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-author">
              <img src={post.profilePic} alt="Profile" className="profile-pic" />
              <div className="author-info">
                <span className="author-name">{post.author}</span>
                <span className="post-time">{formatDate(post.timestamp)}</span>
              </div>
            </div>
            <button className="post-menu">⋯</button>
          </div>

          <div className="post-content">
            {post.content}
          </div>

          {post.image && (
            <div className="post-image">
              <img src={post.image} alt="Post content" />
            </div>
          )}

          <div className="post-stats">
            <div className="likes">
              <span className="like-icon">👍</span>
              <span className="stats-count">{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
            </div>
            <div className="comments-shares">
              <span>{post.comments.length} comments</span>
              <span>0 shares</span>
            </div>
          </div>

          <div className="post-actions">
            <button 
              className={`action-button ${likedPosts.has(post.id) ? 'liked' : ''}`}
              onClick={() => handleLike(post.id)}
            >
              <span>👍 Like</span>
            </button>
            <button 
              className={`action-button ${activeCommentId === post.id ? 'active' : ''}`}
              onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
            >
              <span>💬 Comment</span>
            </button>
            <button className="action-button">
              <span>↗️ Share</span>
            </button>
          </div>

          {activeCommentId === post.id && (
            <div className="comment-section">
              <form className="comment-form" onSubmit={(e) => handleCommentSubmit(post.id, e)}>
                <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
                <div className="comment-input-wrapper">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="comment-input"
                  />
                  <button 
                    type="submit" 
                    className="comment-submit"
                    disabled={!commentText.trim()}
                  >
                    ↪️
                  </button>
                </div>
              </form>

              <div className="comments-list">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <img src={comment.profilePic} alt="Profile" className="profile-pic" />
                    <div className="comment-content">
                      <div className="comment-bubble">
                        <span className="comment-author">{comment.author}</span>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                      <div className="comment-actions">
                        <button>Like</button>
                        <button>Reply</button>
                        <span className="comment-time">{formatDate(comment.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostFeed;