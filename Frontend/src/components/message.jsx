import React from 'react';
//import '../styles/message.css';

const Message = ({ variant = 'info', children }) => {
  return <div className={`message ${variant}`}>{children}</div>;
};

export default Message;