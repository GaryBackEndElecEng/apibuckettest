import React from 'react'
import Register from "@/components/register/Register";
import type { Metadata } from 'next';
// import { metaRegister } from "@meta/Blog";

// export const metadata: Metadata = metaRegister;


const Page = () => {
    return (

        <div className=" lg:mx-auto lg:container relative mt-20 flex flex-col items-center mx-0  ">
            <Register />
        </div>

    )
}

export default Page