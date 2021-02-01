import React from 'react'

const Contacts = ({contacts, handleDelete}) => {
  return(
    contacts.map(contact =>
      <div key={contact.name} onClick={handleDelete}>
        {contact.name} {contact.number}
        <button type="button" value={contact.name}>delete</button>
      </div>)
  )
}

export default Contacts