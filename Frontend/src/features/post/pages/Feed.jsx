import React, { useState, useEffect, useContext } from 'react'
import '../style/feed.css'
import 'remixicon/fonts/remixicon.css'
import { usePost } from '../hooks/usePost'
import Post from '../components/Post'
import Nav from '../../shared/components/Nav'
import Sidebar from '../../users/components/SideBar'
import {AuthContext} from '../../auth/auth.context'


const CATEGORIES = ['all', 'general', 'tech', 'art', 'music', 'sports', 'food', 'travel']


const Feed = () => {

    const { feed, handleGetFeed, loading, handleLike, handleUnLike } = usePost()
    const [activeCategory, setActiveCategory] = useState('all')

    const {user} = useContext(AuthContext)
    const currentUserId = user?._id || user?.id

    useEffect(() => {
        handleGetFeed(activeCategory)
    }, [activeCategory])


    if (feed === null) {
        return (
            <main className="feed-loading">
                <div className="loading-spinner"></div>
                <p>Loading your feed...</p>
            </main>
        );
    }

    return (
        <main className='feed-page'>
            <Nav />
            <div className="feed">
                <div className="category-tabs">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => setActiveCategory(cat)} >
                            {cat[0].toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="posts">{
                    feed.filter(Boolean).length > 0 ? (
                        feed.filter(Boolean).map(post => (
                            <Post
                                key={post._id}
                                user={post.user}
                                post={post}
                                handleLike={handleLike}
                                handleUnLike={handleUnLike}
                                currentUserId={currentUserId}
                            />
                        ))
                    ) : (
                        <div className="empty-feed">
                            <i className="ri-inbox-line"></i>
                            <p>No posts for this category</p>
                        </div>
                    )}
                </div>
            </div>
            <Sidebar />
        </main>
    )
}

export default Feed
