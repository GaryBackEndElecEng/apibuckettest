"use client"
import { msgType } from '@/lib/Types'
import React from 'react'
type MsgType = {
    setMsg: React.Dispatch<React.SetStateAction<msgType | undefined>>,
    msg: msgType | undefined
}
export default function Message({ msg, setMsg }: MsgType) {

    React.useEffect(() => {
        if (msg && msg.msg) {
            setTimeout(() => {
                setMsg({ loaded: false, msg: "" })
            }, 3000);
        }
    }, []);

    return (
        <React.Fragment>
            {msg && msg.msg &&

                <div className="relative h-[10vh] flex flex-col items-center justify-center text-black" style={{ zIndex: "10000" }}>
                    {msg.loaded ?
                        <div className=" absolute inset-0 flex flex-col text-blue-900 text-2xl top-[20%]" style={{ color: "blue" }}>
                            {msg.msg}

                        </div>
                        :
                        <div className=" absolute inset-0 flex flex-col text-orange-900 text-xl top-[20%]">
                            {msg.msg}
                        </div>
                    }
                </div>
            }
        </React.Fragment>
    )
}
