import { ThemeProvider } from "@/contexts/theme-provider"
import { LogIn } from "./pages/LogIn"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { SignUp } from "./pages/SignUp"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/login' element={<LogIn />} />
                    <Route path="/*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App

