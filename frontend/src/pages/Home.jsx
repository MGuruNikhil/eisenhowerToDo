import List from '@/components/List';
import NavBar from '@/components/navBar';
import { apiUrl } from '@/config';
import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ServerError from './ServerError';
import PageNotFound from './PageNotFound';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CircularSpinner from '@/components/CircularSpinner';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = (localStorage.getItem("token") || '');

    const navigate = useNavigate();
    const [toDo, setToDo] = useState({});

    const [forceReload, setForceReload] = useReducer(x => x + 1, 0);

    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);

    const url = useLocation().pathname;

    let points = url.split('/').filter(str => str !== '');

    let bread = [];

    let tempPath = '';
    for(let i=0;i<points.length;i++) {
        tempPath += '/'+points[i];
        if(i%2!=0) {
            bread.push({
                title: points[i],
                path: tempPath
            })
        }
    }

    let path = '';

    if (points.length == 0) {
        path = "home";
    } else if (points.length == 1 && points[0] == 'home') {
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
            setIsLoading(true);
            axios.get(apiUrl + 'todo', {
                params: {
                    path,
                },
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                if (res.status == 200) {
                    setToDo(res.data);
                    setNotFound(false);
                    setServerError(false);
                    setIsLoading(false);
                } else {
                    setNotFound(false);
                    setServerError(true);
                    setIsLoading(false);
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
                setIsLoading(false);
            });
        } else {
            setNotFound(true);
        }
    }, [path, forceReload]);

    return (
        <div className="w-screen h-screen flex flex-col">
            <NavBar />
            {(serverError) ? <ServerError /> : (notFound) ? <PageNotFound /> :
                <div className='relative md:flex-1 p-2 w-[90%] md:w-[80%] lg:w-[70%] m-auto flex flex-col gap-2'>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link className='hover:underline' to="/">Home</Link>
                            </BreadcrumbItem>
                            {bread && bread.map((item, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <Link className={`hover:underline ${bread.length-1 == index ? 'font-bold text-[#fafafa]' : ''}`} to={item.path}>
                                            {item && item.title ? 
                                                (item.title.length <= 10 ? item.title : item.title.substring(0, 7) + '...') 
                                                : 
                                                ''
                                            }
                                        </Link>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className={`text-center font-black text-xl px-2 py-2 md:fixed md:top-2 md:z-10 md:left-1/2 md:transform md:-translate-x-1/2`}>
                        {toDo && toDo.title ? 
                            (toDo.title.length <= 20 ? toDo.title : toDo.title.substring(0, 17) + '...') 
                            : 
                            ''
                        }
                    </h1>
                    <div className="md:flex-1 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 md:grid-rows-2 lg:grid-rows-2 gap-4 overflow-auto md:max-h-[calc(100vh-100px)]">
                        <List heading={'iu'} titles={toDo.iU} setForceReload={setForceReload} />
                        <List heading={'in'} titles={toDo.iN} setForceReload={setForceReload} />
                        <List heading={'nu'} titles={toDo.nU} setForceReload={setForceReload} />
                        <List heading={'nn'} titles={toDo.nN} setForceReload={setForceReload} />
                    </div>
                    {isLoading && <CircularSpinner Width="30px" StrokeWidth="3"/>}
                </div>
            }
        </div>
    )
}

export default Home
