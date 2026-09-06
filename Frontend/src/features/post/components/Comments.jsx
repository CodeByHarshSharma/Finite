import { useState, useRef, useEffect } from "react";
import timeAgo from "../utils/timeAgo";
import { addComments, deleteComments, getComments } from "../services/comment.api";

const Comments = ({ postId, currentUserId, onCountChange }) => {

    const [comments, setComments] = useState(null)
    const [text, setText] = useState('')
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState('')

    const inputRef = useRef('')

    useEffect(() => {
        let cancelled = false

        getComments(postId)
            .then(data => {
                if (cancelled) return
                setComments(data.comments)
                onCountChange?.(data.comments.length)
            })
            .catch(() => {
                if (cancelled) return
                setComments([])
                setError("Couldn't load comments. Try again in a moment.")
            })

        return () => {
            cancelled = true
        }
    }, [postId])

    useEffect(() => {
        inputRef.current?.focus({ preventScroll: true })
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        const value = text.trim()

        if (!value || posting) return


        setPosting(true)
        setError('')

        try {
            const data = await addComments(postId, value)
            setComments(prev => {
                const next = [...(prev || []), data.comment]
                onCountChange?.(next.length)
                return next
            })
            setText('')
        }
        catch (err) {
            setError(err?.response?.data?.message || "Comment couldn't send. Try again")
        }
        finally {
            setPosting(false)
        }

    }

    async function handleDelete(commentId) {
        const previous = comments

        setComments(prev => {
            const next = prev.filter(c => c._id !== commentId)
            onCountChange?.(next.length)
            return next
        })

        try {
            await deleteComments(commentId)
        }
        catch {
            setComments(previous)
            onCountChange?.(previous.length)
            setError("Couldn't delete that comment")
        }
    }


    return (
        <section className="comments">

            {comments === null ? (
                <p className="comment-status">Loading Comments...</p>
            ) : comments.length === 0 ? (
                <p className="comment-status">No Comments yet. Start the conversation.</p>
            ) : (
                <ul className="comment-list">
                    {comments.map(comment => (
                        <li key={comment._id} className="comment">
                            <img className="comment-avatar"
                                src={comment.user?.profileImage}
                                alt={comment.user?.username || 'user'}
                                loading="lazy"
                            />
                            <div className="comment-body">
                                <div className="comment-head">
                                    <span className="comment-author">{comment.user?.username}</span>
                                    <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                            {currentUserId && comment.user?._id === currentUserId && (
                                <button className="comment-delete" onClick={() => handleDelete(comment._id)} aria-label="Delete comment">
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="comments-error">{error}</p>}

            <form className="comment-form" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    id={`comment-input-${postId}`}
                    name="comment"
                    className="comment-input"
                    type="text"
                    value={text}
                    maxLength={280}
                    placeholder="Add a comment"
                    onChange={(e) => setText(e.target.value)} />
                <button className="comment-submit"
                    type="submit"
                    disabled={!text.trim() || posting}>
                    {posting ? 'Posting' : 'Post'}
                </button>
            </form>
        </section>
    )
}

export default Comments