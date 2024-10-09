import {  useContext } from "react";
import ThemeContext from "@/components/ThemeContext";

const DarkMode = ({children}) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode value
  return (
    <div className={`${isDarkMode ? 'bg-black ' : 'bg-white '}`}>
        {children}
    </div>
  )
}

export default DarkMode