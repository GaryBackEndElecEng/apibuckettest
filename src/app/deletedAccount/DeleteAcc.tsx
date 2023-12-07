"use client";
import { userType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import React from 'react';
import { genHash } from "@lib/ultils";

type contType = {
    user: userType,
    message: string
}
type pswdType = {
    loaded: boolean,
    message: string,
    pswd: string
}
export default function DeleteAcc({ email }: { email: string }) {
    const [confirmed, setComfirmed] = React.useState<{ loaded: boolean, email: string }>({ loaded: false, email: "" });
    const [confirmPswd, setComfirmPswd] = React.useState<pswdType>({ loaded: false, message: "", pswd: "" });

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (confirmPswd && confirmPswd.loaded) {
            try {
                const res = await fetch(`/api/user$email=${email}`, { method: "DELETE" });
                if (res.ok) {
                    const body: contType = await res.json();
                    setComfirmed({ loaded: true, email: body.user.email });
                }
            } catch (error) {
                const msg = getErrorMessage(error);
                console.error(`${msg}@Confirmed@user@deleteUser`)
            }
        }
    }
    const handleConfirmPswd = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (confirmPswd.pswd) {
            const password = genHash(confirmPswd.pswd)
            try {
                const res = await fetch(`/api/confirmpswd?pswd=${password}&email=${email}`)
                if (res.ok) {
                    const body: pswdType = await res.json();
                    setComfirmPswd(body)
                }
            } catch (error) {
                const msg = getErrorMessage(error);
                console.error(`${msg}@deleteAcc@confirmPswd`)
            }
        }
    }
    return (
        <React.Fragment>
            {confirmPswd && confirmPswd.message && confirmPswd.loaded ?
                <div className="mx-auto px-1">
                    <div className="text-center text-xl" onClick={(e) => handleSubmit(e)}> click to delete your account</div>
                    {confirmed.loaded &&
                        <React.Fragment>
                            <h3 className="text-center text-xl"> your account has been deleted from our database.</h3>
                            <h4 className="text-center text-xl"> Thank-you for participating,,, we appreciate service.</h4>
                            <h4 className="text-center text-xl">Please send us an email to tell us why you deleted your account so we can improve our services!</h4>

                        </React.Fragment>
                    }
                </div>
                :
                <div className="flex flex-col items-center justify-center lg:container mx-auto">
                    <h3> Your password did not match: {confirmPswd.pswd}</h3>
                </div>
            }
            <form className="flex flex-col justify-center items-center">
                <label htmlFor="pswd">enter password</label>
                <input
                    name="pswd"
                    id="pswd"
                    value={confirmPswd.pswd}
                    onChange={(e) => setComfirmPswd({ ...confirmPswd, pswd: e.target.value })}
                />
                {confirmPswd.pswd &&
                    <button className="buttonsm bg-slate-600 text-white" onClick={(e) => handleConfirmPswd(e)}></button>
                }
            </form>
        </React.Fragment>
    )
}