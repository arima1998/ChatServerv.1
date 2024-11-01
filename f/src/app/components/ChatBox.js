"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for routing
import { useUser } from "@/app/UserContext"; // Import the UserContext
import styles from "./ChatBox.module.css"; // Importing CSS module for styling

const ChatBox = () => {
  const [room, setRoom] = useState("");
  const { setUsername } = useUser(); // Get setUsername from context

  const router = useRouter(); // Initialize the router

  const handleEnter = () => {
    // Navigate to the chat page with query parameters
    router.push(`/chat/${room}`);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value); // Set username in context
  };

  return (
    <div className={styles.chatBox}>
      <h2 className={styles.header}>Chatty Bee</h2>
      <span className={styles.icon}>🐝</span>{" "}
      {/* You can replace this with any icon */}
      <input
        type="text"
        placeholder="Enter Username"
        onChange={handleUsernameChange} // Update to use context
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Enter Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleEnter} className={styles.button}>
        Enter ChattyBee
      </button>
    </div>
  );
};

export default ChatBox;
