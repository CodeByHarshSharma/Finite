import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true
})

export async function getComments(postId){
    const response = await api.get("/api/posts/comments/" + postId)
    return response.data
}

export async function addComments(postId, text){
    const response = await api.post("/api/posts/comments/" + postId, { text })
    return response.data
}

export async function deleteComments(commentsId){
    const response = await api.delete("/api/posts/comments/" + commentsId)
}