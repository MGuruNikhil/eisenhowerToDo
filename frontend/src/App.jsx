import { ThemeProvider } from "@/contexts/theme-provider"
import { LogIn } from "./pages/LogIn"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { SignUp } from "./pages/SignUp"
import { SystemThemeProvider } from "./contexts/SystemThemeProvider"

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SystemThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/login' element={<LogIn />} />
                        <Route path="/*" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </SystemThemeProvider>
        </ThemeProvider>
    )
}

export default App

