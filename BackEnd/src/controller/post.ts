import { Request, Response } from "express";

import Post from "../models/post_model";
import { broadcastPostMessage } from "../socket_server"
import { CtrlReq, CtrlRes } from "../common/req_res_wrapper"
/**
 * Gets all the posts
 * * @param {http request} req
 *  * @param {http response} res
 *  */
 export const getAllPosts = async (req: Request, res: Response) => {
  console.log("getAllPosts");

  try {
    const sender = req.query.sender;
    let posts;
    if (sender != null || sender != undefined) {
      posts = await Post.find({ sender: sender });
    } else {
      posts = await Post.find();
    }
    res.status(200).send(posts);
  } catch (err) {
    res.status(400).send({
      err: err.message,
    });
  }
};

/**
 * Get a specific post by ID
 * @param {http request} req
 * @param {http response} res
 */
 export const getPostById = async (req: Request, res: Response) => {
  console.log("getPostById id=" + req.params.id);
  const id = req.params.id;
  if (id == null) {
    return res.status(400).send({ err: "no id provided" });
  }

  try {
    const post = await Post.findById(id);
    if (post == null) {
      res.status(400).send({
        err: "post does not exists",
      });
    } else {
      res.status(200).send(post);
    }
  } catch (err) {
    res.status(400).send({
      err: err.message,
    });
  }
};

/**
 * Get posts written by the specified user
 * @param {http request} req
 * @param {http response} res
 */
export const getPostByUser = async (req: Request , res: Response ) => {
  const user = req.params.user;
  if(!user) {
    return res.status(400).send("no user Id provided")
  }
  try {
    const posts = await Post.find({ sender: user })
    if(!posts || posts.length <= 0) {
      res.status(200).send("No posts by user found")
    } else {
      return res.status(200).send(posts)
    }
  } catch (err) {
    res.status(400).send( {err: err.message})
  }
}

/**
 * Create new post
 * @param {http request} req
 * @param {http response} res
 */
 export const createNewPost = async (req: Request | CtrlReq, res: Response | CtrlRes) => {
  console.log(req.body);
  const sender = req.body._id;
  const post = new Post({
    message: req.body.message,
    sender: sender,
  });

  try {
    const newPost = await post.save();
    //send notification to all others users
    broadcastPostMessage({ sender: sender, message: req.body.message, _id: post._id})
    res.status(200).send({ sender: sender, message: req.body.message, _id: post._id });
  } catch (err) {
    res.status(400).send({
      err: err.message,
    });
  }
};


/**
 * Delete posts by ID
 * @param req
 * @param res
 */
 export const deletePostById = async (req: Request, res: Response) => {
  console.log("deletePostById id=" + req.params.id);
  const id = req.params.id;
  if (id == null) {
    return res.status(400).send({ err: "no id provided" });
  }

  try {
    await Post.deleteOne({ _id: id });
    res.status(200).send();
  } catch (err) {
    res.status(400).send({
      err: err.message,
    });
  }
};



/**
 * update existing users post
 * @param {http request} req
 * @param {http response} res
 */

 export const updateUsersPost = async (req: Request , res: Response ) => {
  console.log("getPostById id=" + req.params.id);
   const id = req.params.id;
   const msg = req.params.msg;
   if (id == null) {
     return res.status(400).send({ err: "no id provided" });
   }
 
   try {
     const post = await Post.findById(id);
     if (post == null) {
       res.status(400).send({
         err: "post does not exists",
       });
     } else {
       post.overwrite({id:id,message:msg})
       res.status(200).send(post);
     }
   } catch (err) {
     res.status(400).send({
       err: err.message,
     });
   }
 };