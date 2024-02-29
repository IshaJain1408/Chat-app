

import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

export default function RegisterAndLoginForm() {
    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    const [action, setAction] = useState('register'); // 'login' or 'register'
    const { loggedInUser, setLoggedInUsername, setId } = useContext(UserContext);

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `https://chat-app-1-gy38.onrender.com/${action}`,
                { username: user.username, password: user.password },
                { withCredentials: true }
            );

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loggedInUser', response.data.username);

            setLoggedInUsername(response.data.username);
            setId(response.data.id);
        } catch (error) {
            console.error(`Error during ${action}:`, error);
            // Handle the error, e.g., display an error message to the user
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Verify the token with the server
            axios.post('https://chat-app-1-gy38.onrender.com//verifyToken', { token })
                .then((response) => {
                    // If the token is valid, set the user as authenticated
                    setLoggedInUsername(response.data.username);
                })
                .catch((error) => {
                    console.error('Error verifying token:', error);
                    // Remove invalid token from local storage
                    localStorage.removeItem('token');
                });
        }
    }, [setLoggedInUsername]);

    const handleLogout = () => {
        // Your logout logic here, such as clearing local storage or making a server request
        localStorage.removeItem('token');
        setLoggedInUsername('');
        setId(''); // Assuming setId is a function to set the user ID
    };

    return (
        <div className="relative flex flex-col items-center h-screen bg-white">
            <img src="https://img.freepik.com/free-vector/vector-icon-set-chat-bubble-white-blue-message-texting_134830-1235.jpg?t=st=1708598281~exp=1708601881~hmac=2af9dba956a8361ab9c720a58cf9119377c8ef39d914f628ad65a4d72511f8fa&w=900" alt="Logo" className='object-contain w-20 h-20 mx-auto mt-20 mb-1' />
            <h1 className='mx-auto mt-1 font-bold mb-7 '> Wave Messenger</h1>

            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input
                    value={user.username}
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder="username"
                    className="block w-full p-2 mb-2 border rounded-sm"
                />
                <input
                    value={user.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="password"
                    className="block w-full p-2 mb-2 border rounded-sm"
                />
                
                <button className="block w-full p-2 text-white bg-blue-500 rounded-sm">
                    {action === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="mt-2 text-center">
                    {action === 'register' && (
                        <div>
                            Already a member?
                            <button className="ml-1" onClick={() => setAction('login')}>
                                Login here
                            </button>
                        </div>
                    )}
                    {action === 'login' && (
                        <div>
                            Dont have an account?
                            <button className="ml-1" onClick={() => setAction('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </form>
            {loggedInUser ? (
                <button
                    onClick={handleLogout}
                    className="block w-64 p-2 mx-auto text-white bg-red-500 rounded-sm"
                >
                    Logout
                </button>
            ) : null}
        </div>
    );
}


