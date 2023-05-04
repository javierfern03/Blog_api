const Post = require('../models/post.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');
const { storage } = require('../utils/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const PostImg = require('../models/postImg.model');

exports.findAllPost = catchAsync(async (req, res) => {
  const posts = await Post.findAll({
    where: {
      status: 'active',
    },
    attributes: {
      exclude: ['userId', 'status'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl'],
      },
      {
        model: PostImg,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 20,
  });

  const postPromises = posts.map(async (post) => {
    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });

    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlProfile = await getDownloadURL(imgRefUser);
    post.user.profileImgUrl = urlProfile;

    const postImgResolved = await Promise.all(postImgsPromises);
    post.postImg = postImgResolved;

    return posts;
  });

  const postResolved = await Promise.all(postPromises);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    posts: postResolved,
  });
});

exports.createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const post = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  const postImgsPromises = req.files.map(async (file) => {
    const imgRef = ref(storage, `posts/${Date.now()}-${file.originalname}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return PostImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgsPromises);

  res.status(201).json({
    status: 'success',
    message: 'The post has been created',
    post,
  });
});

exports.findMyPost = catchAsync(async (req, res) => {
  const { myPost } = req;

  res.status(200).json({
    status: 'success',
    post: myPost,
  });
});

exports.findUserPost = catchAsync(async (req, res) => {
  const { user } = req;
  const posts = await Post.findAll({
    where: {
      userId: user.id,
      status: 'active',
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'passwordChangeAt'] },
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findOnePost = catchAsync(async (req, res) => {
  const { post } = req;

  //imagen de usuario dueño del post
  const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
  const urlProfileUser = await getDownloadURL(imgRefUserProfile);

  post.user.profileImgUrl = urlProfileUser;
  //imagenes posteadas en el post
  const postImgsPromises = post.postImgs.map(async (postImg) => {
    const imgRef = ref(storage, postImg.postImgUrl);
    const url = await getDownloadURL(imgRef);

    postImg.postImgUrl = url;
    return postImg;
  });

  //imagenes de los usuarios dueños el comentario en el post
  const userImgsCommentPromises = post.comments.map(async (comment) => {
    const imgRef = ref(storage, comment.user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    comment.user.profileImgUrl = url;
    return comment;
  });

  const arrPromises = [...postImgsPromises, ...userImgsCommentPromises];

  await Promise.all(arrPromises);

  res.status(200).json({
    status: 'success',
    post,
  });
});

exports.updatePost = catchAsync(async (req, res) => {
  const { post } = req;
  const { title, content } = req.body;

  await post.update({
    title: title,
    content: content,
  });

  res.status(200).json({
    status: 'success',
    message: 'The post has been updated',
  });
});

exports.deletePost = catchAsync(async (req, res) => {
  const { post } = req;

  await post.update({
    status: 'desabled',
  });

  res.status(200).json({
    status: 'success',
    message: 'post has been delete successfully',
  });
});
