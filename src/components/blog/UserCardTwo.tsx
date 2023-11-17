import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";

export default function UserCardTwo({ user }: { user: userType | undefined }) {
    return (
        <>
            {user &&
                <div className="userCardTwo">
                    <div className="flexrowsm">
                        {user.name && user.image && <Image src={user.image} width={50} height={50} alt={user.name} className="profileImageTwo" />}
                        <h3>{user.name}</h3>
                    </div>
                    <div className="line-break-sm" />
                    <p>
                        {user.bio}
                    </p>

                </div>
            }
        </>
    )
}