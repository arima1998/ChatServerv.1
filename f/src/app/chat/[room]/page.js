"use client";
import React from "react"; // Use useSearchParams to access query parameters
import { useUser } from "@/app/UserContext";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { io } from "socket.io-client";
import { useRouter } from "next/compat/router";

export default function Chat({ params }) {
  const { username } = useUser();
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const roomParam = React.use(params).room;

  useEffect(() => {
    if (roomParam) {
      setRoom(roomParam);
    }
  }, [roomParam]);

  useEffect(() => {
    if (username && room) {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      // Join the room with username
      newSocket.emit("joinRoom", { username, room });

      // Listen for messages from the server
      newSocket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // Listen for updates to the list of connected users
      newSocket.on("userList", (userList) => {
        setUsers(userList);
      });

      // Clean up on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [username, room]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("chatMessage", { room, user: username, message });
      setMessage(""); // Clear message input
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white text-center font-bold text-lg">
        Room: {room}
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar for connected users */}
        <div className="w-1/4 p-4 bg-gray-200 overflow-y-auto">
          <h2 className="font-semibold text-lg mb-4">Connected Users</h2>
          <ul className="space-y-2">
            {users.map((user, index) => (
              <li key={index} className="p-2 bg-white rounded-md shadow-sm">
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Main chat area */}
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div className="space-y-3 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-xs ${
                  msg.user === username
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-300 flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
