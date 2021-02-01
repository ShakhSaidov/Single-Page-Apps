import React from 'react'

const Search = (props) => {
  return(
    <div>
      Contacts shown with <input value={props.value} onChange={props.handleSearchChange}/>
    </div>
  )
}

export default Search