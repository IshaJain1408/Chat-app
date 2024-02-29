import { useContext, useEffect, useState, useRef } from "react";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";
import Profile from "./Profile";


export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { loggedInUsername, id, setId, setLoggedInUsername}= useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  

  const divUnderMessages = useRef();

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    connectToWs();
  }, []);
  function connectToWs() {
    const newWs = new WebSocket("wss://chat-app-1-gy38.onrender.com");

    setWs(newWs);
    newWs.addEventListener("message", handleMessage);
    return () => {
      newWs.removeEventListener("message", handleMessage);
      newWs.close();
      newWs.addEventListener("close", () =>
        setTimeout(() => {
          console.log("Disconnected. Trying to reconnect.");
          connectToWs();
        }, 1000)
      );
    };
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log(ev, messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }
  function logout(){
     axios.post('/logout').then(()=>{
        setWs(null);
        setId(null);
        setLoggedInUsername(null);
     })
  }
  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText('');
      setMessages(prev => ([...prev,{
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  }
  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      console.log(offlinePeople, offlinePeopleArr);
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);
  

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`/messages/${selectedUserId}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];
  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (

<div className="flex h-screen">
<div className="flex flex-col w-1/3 bg-cyan-200">
  <div className="flex-grow">
    <Logo />
  {Object.keys(onlinePeopleExclOurUser).map(userId => (
    <Contact
      key={userId}
      id={userId}
      online={true}
      username={onlinePeopleExclOurUser[userId]}
      onClick={() => {setSelectedUserId(userId); console.log({userId})}}
      selected={userId === selectedUserId}
      lastSeen={onlinePeopleExclOurUser[userId].lastSeen} 
    />
  ))}
  {Object.keys(offlinePeople).map(userId => (
    <Contact
      key={userId}
      id={userId}
      online={false}
      username={offlinePeople[userId].username}
      onClick={() => setSelectedUserId(userId)}
      selected={userId === selectedUserId}
      lastSeen={offlinePeople[userId].lastSeen}
    />
  ))}


  </div>
  <div className="flex items-center justify-center p-2 text-center">
    <span className="flex items-center mr-2 text-sm text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
      {loggedInUsername}
    </span>
    <button
      onClick={logout}
      className="px-2 py-1 text-sm text-gray-500 bg-blue-100 border rounded-sm">logout</button>
  </div>
</div>
<div className="flex flex-col w-2/3 p-0 ">


  <div className="flex-grow p-0">
    {!selectedUserId && (
        <div className="flex items-center justify-center h-full">
  <div className="p-8 text-center">
    <img src="https://img.freepik.com/free-vector/vector-icon-set-chat-bubble-white-blue-message-texting_134830-1235.jpg?t=st=1708598281~exp=1708601881~hmac=2af9dba956a8361ab9c720a58cf9119377c8ef39d914f628ad65a4d72511f8fa&w=900" width="320" alt="WhatsApp" className="mx-auto" />
    <div className="text-black">
      <h1 className="text-3xl font-bold">Welcome to Our Chat Application</h1>
      <p className="text-lg">Connect with friends, share messages, and enjoy seamless communication on our platform.</p>
      <div className="mt-4">
        <button className="px-4 py-2 text-gray-900 rounded-full shadow-md bg-cyan-300">Get Started</button>
      </div>
    </div>
    <div className="mt-6 text-black">
    <div className="flex items-center justify-center flex-grow h-full">
  <div className="text-gray-900">&larr; Select a person from the sidebar</div>
</div>      
    </div>
  </div>
</div>

    
      
    )}
    {!!selectedUserId && (
  <div className="relative h-full">
    <div className="fixed top-0 z-10 w-full h-10 p-0 bg-blue-400">
      <div className="flex justify-between p-2 text-white bg-cyan-200">
    {/* Online Users */}
{ onlinePeopleExclOurUser[selectedUserId] && (
  <Profile

    key={selectedUserId}
        id={selectedUserId}
        online={true}
        username={onlinePeopleExclOurUser[selectedUserId]}
        onClick={() => {setSelectedUserId(selectedUserId);console.log({selectedUserId})}}
        selected={selectedUserId} />
)}

{/* Offline Users */}
{ offlinePeople[selectedUserId] && (
  <Profile
    key={selectedUserId}
        id={selectedUserId}
        online={false}
        username={offlinePeople[selectedUserId].username}
        onClick={() => setSelectedUserId(selectedUserId)}
        selected={ selectedUserId} />

)}    
    

</div>      
    </div>
    <div className="absolute left-0 right-0 p-4 overflow-y-scroll top-10 bottom-2">
      {messagesWithoutDupes.map(message => (
        
        <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>

          <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? ' bg-cyan-200 text-gray-900 border':'bg-white text-gray-900 border' )}>
            {capitalizeFirstLetter(message.text)}
            {message.file && (
              <div className="">
                <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                  </svg>
                  {message.file}
                </a>
              </div>
            )}
            {/* <div className={`text-xs ${message.sender === id ? 'text-white-500' : 'text-gray-400'} text-end`}>
  {format(new Date(message.createdAt), 'hh:mm a')}
</div> */}
          </div>
        </div>
      ))}
      <div ref={divUnderMessages}></div>
    </div>
  </div>
)}

  </div>
  {!!selectedUserId && (
    <form className="flex gap-2 p-2" onSubmit={sendMessage}>
      <input type="text"
             value={newMessageText}
             onChange={ev => setNewMessageText(ev.target.value)}
             placeholder="Type your message here"
             className="flex-grow p-2 bg-white border rounded-sm"/>
      <label className="p-2 text-gray-900 border border-gray-200 rounded-sm cursor-pointer bg-cyan-300">
        <input type="file" className="hidden" onChange={sendFile} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
        </svg>
      </label>
      <button type="submit" className="p-2 text-gray-900 rounded-sm bg-cyan-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  )}
</div>
</div>
   
  );
}
