const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//GET request for bloglist
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1})
  response.json(blogs)
})

//POST request to add a blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" })
  }
  const user = await User.findById(decodedToken.id)

  if (body.title === '' || body.url === '') {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

//PUT request to update a blog
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: request.body.likes
  }

  const updatedBloglist = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBloglist)
})

//DELETE request to remove a blog
blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const blog = await Blog.findById(request.params.id)
  if(blog.user.toString() === decodedToken.id){
    await blog.remove()
    response.status(204).end()
  } else {
    response.status(401).json({ error: "User is not permitted to delete this blog"})
  }
})

module.exports = blogsRouter