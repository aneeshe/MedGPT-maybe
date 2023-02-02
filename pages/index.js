import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import { style } from "@mui/system";

// import chat from '/api/chatGPT'

export default function Home() {
  const logo =
    "https://drive.google.com/uc?id=1IGoyc7athVBlqsohJ1-P9WIa_xZ9e0It";
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "",
      type: "apiMessage",
    },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: "Oops! There seems to be an error. Please try again.",
        type: "apiMessage",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: userInput, type: "userMessage" },
    ]);

    // Send user question and history to API
    const response = await fetch("/api/chatGPT.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userInput, history: history }),
    });

    const data = await response.json();

    // Reset user input
    setUserInput("");

    // Load the new message
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: data.result, type: "apiMessage" },
    ]);
    setLoading(false);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([
        [
          messages[messages.length - 2].message,
          messages[messages.length - 1].message,
        ],
      ]);
    }
  }, [messages]);

  //Sets page
  /*
  const Container = dynamic(
    () => {
      return import("../components/Container");
    },
    { ssr: false }
  );
  */

  return (
    <main style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <Head className={styles.newheader}>
          <img
            style={{
              width: "12vw",
              height: "4vw",
              marginLeft: 20,
              marginTop: 20,
              backgroundColor: "#fbfaf3",
            }}
            src={logo}
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className={styles.main}>
          <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit}>
                <textarea
                  disabled={loading}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  autoFocus={false}
                  rows={1}
                  maxLength={512}
                  type="text"
                  id="userInput"
                  name="userInput"
                  placeholder={
                    loading
                      ? "Waiting for response..."
                      : "The patient is experiencing..."
                  }
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={styles.textarea}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.generatebutton}
                >
                  {loading ? (
                    <div
                      style={{ display: "flex", flexDirection: "row" }}
                      className={styles.loadingwheel}
                    >
                      <text
                        style={{
                          paddingTop: "0.3vw",
                          fontSize: "1.60rem",
                          fontWeight: "500",
                        }}
                      >
                        Hmm....
                      </text>
                      <img
                        style={{
                          width: "3vw",
                          height: "3vw",
                          paddingLeft: "4vw",
                          paddingBottom: "4vw",
                        }}
                        src={
                          "https://drive.google.com/uc?id=1uGaKV26tHoU_1qh7Gua-UKrbJY_mW3PY"
                        }
                      ></img>
                    </div>
                  ) : (
                    // Send icon SVG in input field
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <text
                        style={{ paddingTop: "0.4rem" }}
                        className={style.thinktext}
                      >
                        Let's Think
                      </text>
                      <img
                        style={{
                          width: "2.5vw",
                          height: "2.5vw",
                          marginLeft: "2vw",
                          paddingTop: "0.3vw",
                        }}
                        src={
                          "https://drive.google.com/uc?id=18nQlzJDV4UG79M_LWxZzFiWuDeSLgMEa"
                        }
                      ></img>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className={styles.cloud}>
            <div ref={messageListRef} className={styles.messagelist}>
              {messages.map((message, index) => {
                return (
                  // The latest message sent by the user will be animated while waiting for a response
                  <div
                    key={index}
                    className={
                      message.type === "userMessage" &&
                      loading &&
                      index === messages.length - 1
                        ? styles.usermessagewaiting
                        : message.type === "apiMessage"
                        ? styles.apimessage
                        : styles.usermessage
                    }
                  >
                    {/* Display the correct icon depending on the message type */}
                    <div className={styles.markdownanswer}>
                      {/* Messages are being rendered in Markdown format */}
                      <ReactMarkdown linkTarget={"_blank"}>
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <div className={styles.footer}>
        <h1 className={styles.footertext}>{"(C) CogniMate"}</h1>
        <h1 className={styles.footertext}>
          {"Demo Version, Use With Caution"}
        </h1>
      </div>
    </main>
  );
}
