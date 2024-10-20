import {  useContext } from "react";
import ThemeContext from "@/components/Developer Mode/ThemeContext";

const DarkMode = ({children}) => {
  const { isDarkMode } = useContext(ThemeContext); 
  return (
    <div className={`${isDarkMode ? 'bg-black ' : 'bg-white '}`}>
        {children}
    </div>
  )
}

export default DarkMode