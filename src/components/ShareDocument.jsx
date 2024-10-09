import { useState } from "react"
import { Lock } from "@mui/icons-material";
import { Button } from "@mui/material";

const ShareDocument = ({id}) => {
    const [shareDoc, setShareDoc] = useState(false);

  return (
    <div className="mr-1 flex space-x-2 w-1/7 p-4 py-2 rounded-full bg-[#bbdcf2] cursor-pointer z-20">
        <Lock />
        <h2 onClick={() => {
        console.log('Share button clicked');
        setShareDoc(true);
        }}>
        Share
        </h2>

    {shareDoc && (
        <div className="absolute top-20 right-10  bg-gray-100 p-4 rounded-md shadow-md">
        <p>Share this document link:</p>
        <input type="text" value={`https://yourapp.com/doc/${id}`} readOnly className="border p-2 w-full" />
        <Button onClick={() => setShareDoc(false)} className="mt-2 bg-[#2F85F5]">
            Close
        </Button>
        </div>
    )}

    </div>
  )
}

export default ShareDocument