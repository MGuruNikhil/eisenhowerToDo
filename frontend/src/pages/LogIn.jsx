import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiUrl } from '../config'
import CircularSpinner from "@/components/CircularSpinner"
import axios from "axios"
import NavBar from "@/components/navBar"

export function LogIn() {

    const [token, setToken] = useState(localStorage.getItem("token") || '');

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (token != null || token != undefined || token.length > 0) {
            axios.get(apiUrl + 'auth/user', {
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                if (res.status == 200) {
                    console.log(res.data.user);
                    navigate('/');
                }
            }).catch(error => {
                console.log(error.message);
                localStorage.removeItem('token');
                setToken('');
            });
        } else {
            localStorage.removeItem('token');
            setToken('');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        axios.post(apiUrl + "auth/login", {
            username: email,
            password,
        }).then((res) => {
            localStorage.setItem("token", res.data.token)
            setIsLoading(false)
            navigate("/")
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
        });
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <NavBar />
            <div className="flex-1 flex items-center justify-center">
                <Card className="w-[350px] relative overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Log In</CardTitle>
                            <CardDescription>Enter your credentials and login to continue.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="Your registered email adderss" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }} type="password" id="password" placeholder="Password" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button onClick={() => navigate('/signup') } variant="outline">Sign Up</Button>
                            <Button type='submit'>Log In</Button>
                        </CardFooter>
                    </form>
                    {isLoading && <CircularSpinner Width="30px" StrokeWidth="3"/>}
                </Card>
            </div>
        </div>
    )
}
