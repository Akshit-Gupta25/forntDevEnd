import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ onPostCreated, currentUser }) => {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postContent.trim() && !image) return;

    const newPost = {
      id: Date.now(),
      content: postContent,
      image: imagePreview,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      author: currentUser.name,
      profilePic: currentUser.profilePic
    };

    onPostCreated(newPost);
    setPostContent('');
    setImage(null);
    setImagePreview(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="create-post-trigger" onClick={() => setShowModal(true)}>
        <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
        <div className="create-post-input">
          What's on your mind?
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowModal(false);
          }
        }}>
          <div className="create-post-modal">
            <div className="modal-header">
              <h2>Create post</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="user-profile">
                <img src={currentUser.profilePic} alt="Profile" className="profile-pic" />
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <div className="privacy-selector">
                    <button className="privacy-button">
                      <span>🌍</span> Friends <span>▼</span>
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="post-form">
                <textarea
                  placeholder={`What's on your mind, ${currentUser.name}?`}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="post-input"
                  autoFocus
                />
                
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="add-to-post">
                  <span>Add to your post</span>
                  <div className="post-options">
                    <label className="option-button">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      <span>📷</span>
                    </label>
                    <button type="button" className="option-button">👤</button>
                    <button type="button" className="option-button">😊</button>
                    <button type="button" className="option-button">📍</button>
                    <button type="button" className="option-button">🎥</button>
                    <button type="button" className="option-button">⋯</button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="post-button"
                  disabled={!postContent.trim() && !image}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;