import { createContext, useState } from "react";

export const SystemTheme = createContext();

export const SystemThemeProvider = ({children}) => {
    const [isDark, setIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <SystemTheme.Provider value={{isDark}}>
            {children}
        </SystemTheme.Provider>
    );
};