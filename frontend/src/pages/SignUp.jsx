import About from "@/components/About"
import CircularSpinner from "@/components/CircularSpinner"
import NavBar from "@/components/navBar"
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
import { apiUrl } from "@/config"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export function SignUp() {

    const [token, setToken] = useState(localStorage.getItem("token") || '');

    const navigate = useNavigate()

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);

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

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            } else {
                handleSubmit(e);
            }
        }
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (password == confirmPassword) {
            axios.post(apiUrl + "auth/register", {
                username: email,
                password,
                displayName
            }).then((res) => {
                console.log(res.data);
                localStorage.clear();
                setIsLoading(false);
                alert("User Created Successfully, Log In to continue.");
                navigate("/login");
            }).catch((error) => {
                console.log(error);
                setIsLoading(false);
            })
        } else {
            setIsLoading(false);
            alert("Password field and confirm password field must be equal.");
            setPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col bg-[#d4d4d4] dark:bg-background">
            <NavBar />
            <div className="flex-1 w-full flex flex-col-reverse items-center justify-center lg:flex-row lg:overflow-hidden">
                <About />
                <div className="w-0 lg:w-[1px] h-0 lg:h-[80%] bg-foreground rounded-full"></div>
                <div className="lg:flex-1 flex items-center justify-center">
                    <Card className="w-[350px] relative overflow-hidden">
                        <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>Enter your credentials and sign up to create an account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="displayName">Name</Label>
                                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} ref={(el) => (inputRefs.current[0] = el)} onKeyDown={(e) => handleKeyDown(e, 0)} type="text" id="displayName" placeholder="Your name" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} ref={(el) => (inputRefs.current[1] = el)} onKeyDown={(e) => handleKeyDown(e, 1)} type="email" id="email" placeholder="Your email adderss" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} ref={(el) => (inputRefs.current[2] = el)} onKeyDown={(e) => handleKeyDown(e, 2)} type="password" id="password" placeholder="Password" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} ref={(el) => (inputRefs.current[3] = el)} onKeyDown={(e) => handleKeyDown(e, 3)} type="password" id="confirmPassword" placeholder="Confirm Password" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type='submit'>Sign Up</Button>
                            <Button onClick={() => navigate('/login') } variant="outline">Log In</Button>
                        </CardFooter>
                        </form>
                        {isLoading && <CircularSpinner Width="30px" StrokeWidth="3"/>}
                    </Card>
                </div>
            </div>
        </div>
    )
}

