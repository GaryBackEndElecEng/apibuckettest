import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";

export default function UserCard({ user }: { user: userType }) {
    return (
        <>
            {user &&
                <div className="userCard">
                    <h3>{user.name}</h3>
                    <p>

                        {user.name && user.image && <Image src={user.image} width={50} height={50} alt={user.name} className="profileImage" />}
                        {user.bio}
                    </p>

                </div>
            }
        </>
    )
}
