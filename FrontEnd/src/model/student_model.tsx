import StudentApi from "./student_api"

export type Post = {
    id: String,
    message:String,
    imageUrl: String,
    postId:String
}

const getAllPosts = async ()=>{
    const posts = await StudentApi.getAllPosts()
    return posts
} 

const addNewPost = async (st:Post)=>{
    await StudentApi.addNewPost(st)
} 

const uploadImage = async (imageUri:String)=> {
    const url = await StudentApi.uploadImage(imageUri)
    return url
}

const getPostsByUser = async (mail:String)=> {
    const posts = await StudentApi.getPostsByUser(mail)
    return posts
}

const deletePost = async (id:String)=>{
    await StudentApi.deletePost(id)
} 

const updatePost = async (id:String,message:String)=>{
    await StudentApi.updatePost(id,message)
} 


export default {
    addNewPost,
    getAllPosts,
    uploadImage,
    getPostsByUser,
    deletePost,
    updatePost
}