import { Lock } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState, useContext } from "react";
import ThemeContext from "@/components/ThemeContext";


const ShareDocument = ({id}) => {
    const [shareDoc, setShareDoc] = useState(false);
    const { isDarkMode } = useContext(ThemeContext); // Access dark mode value

  return (
    <div className={`mr-1 flex space-x-2 w-1/7 p-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#bbdcf2]'}  cursor-pointer z-20`}>
        <Lock />
        <h2 onClick={() => {
        console.log('Share button clicked');
        setShareDoc(true);
        }}>
        Share
        </h2>

    {shareDoc && (
        <div className={`absolute top-20 right-10  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-md shadow-md`}>
        <p>Share this document link:</p>
        <input type="text" value={`https://yourapp.com/doc/${id}`} readOnly className={`border ${isDarkMode ? 'bg-gray-700' : ''} p-2 w-full mt-[1vw]`} />
        <Button variant="contained" color="primary" onClick={() => setShareDoc(false)} sx={{marginTop: "1vw"}}>
            Close
        </Button>
        </div>
    )}

    </div>
  )
}

export default ShareDocument