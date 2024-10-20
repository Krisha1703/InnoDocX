import { Button } from "@material-tailwind/react"
import Image from "next/image"
import { signIn } from "next-auth/react"

function Login() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
       <Image src="/docs.png" width={100} height={100} alt="docs" loading="lazy"/>
        <Button
            className="w-44 mt-10 text-white"
            color="blue"
            buttontype="filled"
            ripple="light"
            onClick={signIn}
        >
            Login
        </Button>
    </div>
  )
}

export default Login