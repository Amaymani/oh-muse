import React from 'react'

const PostEngagement = ({ post, userId, openComment, commentOpenPostId, handleCommentChange, commentText, addComment, likePost, closeComment }) => {
    return (
        <div className="post-footer w-full mt-5">
            <div className="engagement-stats">
                <div className='flex justify-start w-full mt-5'>
                    <div className="Likes w-[50%] flex text-xl">
                        <i
                            onClick={() => likePost(post._id)}
                            className={`fa-solid fa-heart hover:text-purp transition-colors duration-150 ${post.likes.includes(userId) ? "text-purp" : ""
                                }`}
                        ></i>
                        <div className="text-sm ml-5">{post.likes.length}</div>
                    </div>
                    <div className="Comments w-[50%] flex text-xl cursor-pointer" onClick={() => openComment(post._id)}>
                        <i className="fa-solid fa-comment hover:text-purp transition-colors duration-150"></i>
                        <div className="text-sm ml-5">{post.comments.length}</div>
                    </div>

                    <div><i className="fa-solid fa-flag hover:text-red-500 transition-colors duration-150"></i></div>
                </div>

                {commentOpenPostId === post._id && (

                    <div className="comment-section w-full mt-5">
                        <form onSubmit={(e) => { addComment(post._id, e) }} className="flex justify-center items-center">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-[80%] p-2 rounded-md"
                                name="commentText"
                                onChange={(e) => { handleCommentChange(e.target.value) }}
                                value={commentText}
                            />
                            <button className="p-2 bg-purp rounded-md ml-2" type="submit">Post</button>
                            <div className="px-2 font-bold cursor-pointer" onClick={() => { closeComment() }} >X</div>
                        </form>
                        <div className="comments-list font-bold w-full mt-5">
                            Anonymous Comments:
                            {post.comments.slice(0, 20).map((comment) => (
                                <div key={comment._id} className="comment w-full font-normal flex text-sm justify-start items-center border-b border-purp py-2">

                                    <div className="comment-username font-semibold">{comment.user.username}</div>
                                    <div className="comment-text ml-2">{comment.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>)}
            </div>
        </div>
    )
}

export default PostEngagement