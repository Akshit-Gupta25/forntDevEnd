import React, { useState } from 'react';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  const currentUser = {
    name: 'John Doe',
    profilePic: 'https://via.placeholder.com/40'
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Social Feed</h1>
      </header>
      <main className="app-content">
        <CreatePost onPostCreated={handlePostCreated} currentUser={currentUser} />
        <PostFeed posts={posts} currentUser={currentUser} />
      </main>
    </div>
  );
}

export default App;
