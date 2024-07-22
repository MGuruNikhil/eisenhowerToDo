import NavBar from '@/components/navBar';
import { apiUrl } from '@/config';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        if(token) {
            axios.get(apiUrl + 'auth/user', {
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                if(res.status == 200) {
                    console.log(res.data.user);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }).catch(error => {
                console.log(error.message);
                localStorage.removeItem('token');
                navigate('/login');
            })
        } else {
            localStorage.removeItem('token');
            navigate('/login');
        }
    },[])

    return (
        <div className="w-screen h-screen flex flex-col">
            <NavBar />
            <div className="flex-1 flex items-center justify-center">
                Home
            </div>
        </div>
    )
}

export default Home
