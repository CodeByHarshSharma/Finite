import React from 'react'
import { useState, useRef } from 'react'
import { usePost } from '../hooks/usePost'
import { useNavigate } from 'react-router'
import BorderGlow from '../../auth/components/BorderGlow'

const CATEGORIES = ['general', 'tech', 'art', 'music', 'sports', 'food', 'travel']

const CreatePost = () => {

    const [postType, setPostType] = useState('image')
    const [caption, setCaption] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("general")
    const postImageInputFieldRef = useRef(null)
    const [fileName, setFileName] = useState("")

    const navigate = useNavigate()

    const { loading, handleCreatePost } = usePost()

    async function handleSubmit(e) {
        e.preventDefault()

        if (postType === 'image') {
            const file = postImageInputFieldRef.current.files[0]
            if (!file) return
            await handleCreatePost({ type: 'image', imageFile: file, caption, category })
        }

        else {
            if (!content.trim()) return
            await handleCreatePost({ type: 'text', content, category })
        }
        navigate('/')
    }

    if (loading) {
        return (
            <main>
                <h1>Creating Post...</h1>
            </main>
        )
    }
    return (
        <main className='create-post-page'>
            <BorderGlow edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#120F17"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}>
                <div className="form-container">
                    <h1>Create Post</h1>

                    <div className="post-type-toggle">
                        <button
                            type="button"
                            className={postType === 'image' ? 'active' : ''}
                            onClick={() => setPostType('image')}
                        >
                            <i className="ri-image-line"></i> Photo
                        </button>
                        <button
                            type="button"
                            className={postType === 'text' ? 'active' : ''}
                            onClick={() => setPostType('text')}
                        >
                            <i className="ri-text"></i> Text
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {postType === 'image' ? (
                            <>
                                <label htmlFor="postImage">Select Image</label>
                                <input hidden ref={postImageInputFieldRef} type="file" name="postImage" id="postImage" accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            setFileName(file.name)
                                        }
                                    }} />
                                {fileName && (<p className="selected-file"> {fileName} </p>)}
                                <input value={caption} type="text" name="caption" id="caption" placeholder="Enter Caption"
                                    onChange={(e) => setCaption(e.target.value)} />
                            </>
                        ) : (
                            <div className="text-post-compose">
                                <textarea
                                    value={content}
                                    maxLength={280}
                                    placeholder="What's happening?"
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <span className="char-count">{content.length}/280</span>
                            </div>
                        )}

                        <label htmlFor="category">Select Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>

                        <button className="button primary-button"> Create Post </button>
                    </form>
                </div>
            </BorderGlow>
        </main>
    )
}

export default CreatePost
