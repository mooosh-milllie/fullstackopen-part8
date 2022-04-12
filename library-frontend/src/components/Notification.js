import React from 'react'
const notifStyle = {
  border: '1px solid teal',
  backgroundColor: 'whitesmoke',
  fontSize: '15px',
  padding: '3px',
  transition: 'all .3s ease'
}
const Notification = ({message}) => {
  if (!message) {
    return null;
  }
  return (
    <div style={notifStyle} >
      <p>{message}</p>
    </div>
  )
}

export default Notification;