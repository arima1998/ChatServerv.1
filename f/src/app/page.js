"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/components/Loading"; // Import the Loading component
import ChatBox from "@/app/components/ChatBox"; // Import the ChatBox component
import styles from "./page.module.css"; // Importing CSS module for page styling
import HomePage from "./components/Test";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {!loading && <ChatBox />} {/* Show ChatBox after loading */}
    </div>
  );
}
