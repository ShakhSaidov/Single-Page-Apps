const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.testBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET request for blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('bloglist is updated correctly and each has an "id" as a unique identifier', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.testBlogs.length)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('POST request for blog', () => {
  test('a blog is correctly posted, and the amount of likes is defaulted to 0 if not provided', async () => {
    const newBlog = {
      _id: "0",
      title: "Test",
      author: "John Doe",
      url: "http://test.html",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //checking if the length of the blogList increased
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.testBlogs.length + 1)

    //checking if the title of the blog matches
    const title = blogsAfter.map(b => b.title)
    expect(title).toContain('Test')

    //checking if the # of likes = 0 if not provided
    const numberOfLikes = blogsAfter[blogsAfter.length - 1].likes
    expect(numberOfLikes).toEqual(0)
  })
})

describe('Bad requests', () => {
  test('server returns 400 bad request if title/url is missing', async () => {
    const newBlog = {
      _id: "0",
      author: "John Doe",
      likes: 1,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})