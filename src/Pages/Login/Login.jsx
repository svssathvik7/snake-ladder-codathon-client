import React, { useContext, useState } from 'react'
import "./Login.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { loginDataContextProvider } from '../../Contexts/LoginDataContext';
import { socketContextProvider } from '../../Contexts/SocketContext';
export default function Login() {
    const { socket } = useContext(socketContextProvider);
    const navigate = useNavigate();
    const { formData, setFormData } = useContext(loginDataContextProvider);
    const handleFormChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }
    const handleFormSubmit = async () => {
        try {
            socket.emit('login', { regNo: formData.username, password: formData.password });

            socket.on('login-result', async (data) => {
                if (data !== false) {
                    const regNo = formData?.username;
                    localStorage.setItem('user', regNo);
                    navigate('/map');
                }
                else {
                    toast.error("Login failed!", {
                        position: "top-right",
                        autoClose: 7000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            });
        } catch (error) {
            toast.error("Login failed!", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }
    return (
        <div className='login-page'>
            <div className='login-controller'>
                <div>
                    <h1>Login</h1>
                    <input className='login-inputs' name='username' type='text' placeholder='Enter RegdNo' value={formData.username} onChange={handleFormChange} />
                    <input className='login-inputs' value={formData.password} name='password' type='password' onChange={handleFormChange} placeholder='Enter password' />
                    <button onClick={handleFormSubmit} type='submit' className='login-btn'>Login</button>
                </div>
            </div>
        </div>
    )
}