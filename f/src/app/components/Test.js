"use client"; // Run client-side

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function HomePage() {
  const [socket, setSocket] = useState(null); // Initialize socket state
  const [messages, setMessages] = useState([]); // State to hold messages
  const [room, setRoom] = useState(""); // State to hold the room name

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Create a new socket instance
    setSocket(newSocket); // Save the socket instance in state

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Listen for new messages from the server
    newSocket.on("newMessage", (data) => {
      console.log("New message from server:", data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]); // Update messages state
    });

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to join a room
  const joinRoom = () => {
    if (socket && room) {
      socket.emit("joinRoom", room); // Emit joinRoom event with the room name
      setMessages([]); // Clear messages on room change
    }
  };

  // Function to emit a message to the server
  const sendMessage = () => {
    if (socket && room) {
      socket.emit("customEvent", { message: "Hello from Next.js!", room }); // Send message with room info
    }
  };

  return (
    <div>
      <h1>Socket.IO Client with Next.js</h1>

      <input
        type="text"
        placeholder="Enter room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)} // Update room state
      />
      <button onClick={joinRoom}>Join Room</button>

      <button onClick={sendMessage}>Send Message to Room</button>

      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
