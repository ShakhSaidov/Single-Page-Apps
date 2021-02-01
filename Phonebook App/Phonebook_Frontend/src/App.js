import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import ContactForm from './components/ContactForm'
import Contacts from './components/Contacts'
import contactService from './services/phonebook'

const Message = ({ message, error }) => {
  if (message === null) {
    return (
      null
    )
  }
  else if (error) {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  else {
    return (
      <div className="non-error">
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const contacts = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase()))

  const hook = () => {
    contactService
      .getAll()
      .then(people => {
        setPersons(people)
      })
  }
  useEffect(hook, [])

  const addName = e => {
    e.preventDefault();
    const contact = persons.find(p => p.name === newName)
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook! Do you want to replace the old number with a new one?`)) {
        const changedPerson = { ...contact, number: newNumber }
        const id = contact.id
        contactService
          .update(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(
              `New number put for ${newName}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessage(
              `Information of '${newName}' has already been removed from server`
            )
            setError(true)
            setTimeout(() => {
              setMessage(null)
              setError(false)
            }, 5000)
          })
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }

      contactService
        .add(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(
            `Added ${newName} to the phonebook`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(
            error.response.data.error
          )
          setError(true)
          setTimeout(() => {
            setMessage(null)
            setError(false)
          }, 5000)
          setPersons(persons.filter(p => p.id !== contact.id))
        })
    }
  }

  const handleSearchChange = (e) => {
    setNewSearch(e.target.value)
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    const contactToDelete = persons.find(person => person.name === e.target.value)
    if (window.confirm(`Delete ${contactToDelete.name} ?`)) {
      contactService
        .remove(contactToDelete.id)
        .then(() =>
          setMessage(
            `Removed ${contactToDelete.name} from the phonebook`
          ),
          setTimeout(() => {
            setMessage(null)
          }, 5000),
          setPersons(persons.filter(p =>
            p.id !== contactToDelete.id
          ))
        )


    }
  }

  return (
    <div>
      <Message message={message} error={error} />
      <h2>Phonebook</h2>
      <Search value={newSearch} handleSearchChange={handleSearchChange} />

      <h3>Add Contact</h3>
      <ContactForm addName={addName} name={newName} nameChange={handleNameChange}
        number={newNumber} numberChange={handleNumberChange} />

      <h3>Contacts</h3>
      <Contacts contacts={contacts} handleDelete={(event) => handleDelete(event)} />
    </div>
  )
}

export default App