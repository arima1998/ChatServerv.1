import React from "react";
import styles from "./Loading.module.css"; // Importing CSS module for styling

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingText}>Chat is getting ready...</div>
    </div>
  );
};

export default Loading;
