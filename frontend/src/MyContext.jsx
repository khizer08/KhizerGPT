import { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);

  const [currThreadId, setCurrThreadId] = useState(null);

  return (
    <MyContext.Provider
      value={{
        prompt,
        setPrompt,
        reply,
        setReply,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
        currThreadId,
        setCurrThreadId,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
