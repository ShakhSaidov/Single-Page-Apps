import React, { useState } from 'react'
import '../App.css'
import PropTypes from 'prop-types'

const Details = ({blog, handleLikes, handleRemoval}) => {
  return(
    <div>
      <div><a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></div>
      <div>
        Likes: {blog.likes}
        <button onClick={(event) => handleLikes(event, blog.id)}>like</button>
      </div>
      <div>By: {blog.author}</div>
      <button onClick={(event) => handleRemoval(event, blog.id)}>remove</button>
    </div>
  )
}

const Blog = ({ blog, number, handleLikes, handleRemoval}) => {
  const [show, setShow] = useState(false)

  const handleBlogDetails = () => {
    setShow(!show)
  }

  return (
    <div className="BlogStyle">
      <div>
        <b>{number}.</b> {blog.title}
        <button className="SmallToggleButton" onClick={handleBlogDetails}>
          {show ? 'hide' : 'show'}
        </button>
      </div>
      {show
        ? <Details blog={blog} handleLikes={handleLikes} handleRemoval={handleRemoval}/>
        : null
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleRemoval: PropTypes.func.isRequired
}

export default Blog
