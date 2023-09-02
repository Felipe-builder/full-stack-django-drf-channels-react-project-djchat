import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
const socketUrl = "ws://127.0.0.1:8000/ws/test";


const Server = () => {
  const [ message, setMessage ] = useState('');
  const [ inputValue, setInputValue ] = useState('');
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log('Connected!')
    },
    onClose: () => {
      console.log('Closed!')
    },
    onError: () => {
      console.log('Error!')
    },
    onMessage: (msg) => {
      setMessage(msg.data)
    }
  })

  const sendInputValue = () => {
    const message = { text: inputValue};
    sendJsonMessage(message);
    setInputValue('');
  }
  return (
    <div>
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendInputValue}>
        Send
      </button>
      <div>Receive Data: {message}</div>
    </div>
  )
}

export default Server;