import axios from "axios"
import { UserProvider } from "./UserContext";
import Routes from "./Routes";
 function App() {
axios.defaults.baseURL = 'https://chat-app-1-gy38.onrender.com';
axios.defaults.withCredentials = true;


//   axios.defaults.baseURL='http://localhost:4000';
//   axios.defaults.withCredentials=true;

  return (
    <UserProvider>
    <Routes/>
    </UserProvider>
  )
}

export default App
