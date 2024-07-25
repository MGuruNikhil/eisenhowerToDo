import List from '@/components/List';
import NavBar from '@/components/navBar';
import { apiUrl, frontEndUrls } from '@/config';
import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ServerError from './ServerError';
import PageNotFound from './PageNotFound';
import { useTheme } from '@/contexts/theme-provider';

const Home = () => {

    const token = (localStorage.getItem("token") || '');

    const navigate = useNavigate();
    const [toDo, setToDo] = useState({});

    const [forceReload, setForceReload] = useReducer(x => x + 1, 0);

    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);

    const { theme } = useTheme();

    let url = window.location.href;

    for (let i = 0; i < frontEndUrls.length; i++) {
        url = url.replace(frontEndUrls[i], '');
    }

    let points = url.split('/').filter(str => str !== '');
    console.log(points);

    let path = '';

    if (points.length == 0) {
        path = "home";
    } else if (points.length == 1 && points[0] == 'home'){
        path = "home";
    } else {
        if (points.length % 2 == 0) {
            for (let i = 0; i < points.length; i++) {
                path += points[i];
                if (i % 2 == 0) {
                    path += '/';
                } else {
                    path += '~';
                }
            }
            path = path.slice(0, -1);
        }
    }

    path = path.replaceAll('_', ' ');
    console.log("path = ", path);

    useEffect(() => {
        if (token != null || token != undefined || token.length > 0) {
            axios.get(apiUrl + 'auth/user', {
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                if (res.status == 200) {
                    console.log(res.data.user);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }).catch(error => {
                console.log(error.message);
                localStorage.removeItem('token');
                navigate('/login');
            });
        } else {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if (path.length > 0) {
            axios.get(apiUrl + 'todo', {
                params: {
                    path,
                },
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                if(res.status == 200) {
                    setToDo(res.data);
                    setNotFound(false);
                    setServerError(false);
                } else {
                    setNotFound(false);
                    setServerError(true);
                }
            }).catch(error => {
                console.log(error.response.data.message);
                switch (error.response.status) {
                    case 401:
                        localStorage.removeItem('token');
                        navigate('/login');
                    case 404:
                        if (path != 'home') {
                            setServerError(false);
                            setNotFound(true);
                        } else {
                            setToDo({
                                title: "Home",
                                iU: [],
                                iN: [],
                                nU: [],
                                nN: []
                            });
                            setNotFound(false);
                            setServerError(false);
                        }
                        break;
                    default:
                        setNotFound(false);
                        setServerError(true);
                        break;
                }
            });
        } else {
            setNotFound(true);
        }
    }, [path, forceReload]);


    return (
        <div className="w-screen h-screen flex flex-col">
            <NavBar />
            {(serverError) ? <ServerError /> : (notFound) ? <PageNotFound /> :
                <div className='md:flex-1 p-2 w-[90%] md:w-[80%] lg:w-[70%] m-auto flex flex-col gap-2'>
                    <div className={`${theme == 'dark' ? 'bg-[#fafafa] text-[#09090b]': ((theme == 'light') ? 'bg-[#09090b] text-[#fafafa]' : 'bg-gray-500 text-white')} self-center w-fit flex items-center justify-center rounded-lg p-4`}>{toDo.title}</div>
                    <div className="md:flex-1 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 md:grid-rows-2 lg:grid-rows-2 gap-4 overflow-auto">
                        <List heading={'iu'} titles={toDo.iU} setForceReload={setForceReload} />
                        <List heading={'in'} titles={toDo.iN} setForceReload={setForceReload} />
                        <List heading={'nu'} titles={toDo.nU} setForceReload={setForceReload} />
                        <List heading={'nn'} titles={toDo.nN} setForceReload={setForceReload} />
                    </div>
                </div>
            }
        </div>
    )
}

export default Home
