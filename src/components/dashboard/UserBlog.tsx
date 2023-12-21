// "use client"
import React from 'react';
import type { fileType, userType } from '@lib/Types';
import getFormattedDate from "@lib/getFormattedDate";
import Image from 'next/image';
import styles from "@dashboard/dashboard.module.css";
import Link from "next/link";
import "@pages/globalsTwo.css";
import { useRouter } from "next/navigation";



export default function UserBlog({ blog, user }: { blog: fileType, user: userType | null }) {
    const router = useRouter();

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, fileId: string | undefined) => {
        e.preventDefault();
        if (fileId) {
            router.push(`/dashboard/editblog?fileId=${fileId}`)
        }
    }
    const logo = "/images/gb_logo.png";
    return (
        <div className={`blogCard`}>
            <Link href={`/blogs/${blog.id}`} className="blogsLink flexcol">
                <h3 className="text-center text-2xl mb-3">{blog.title.toUpperCase()}</h3>
                {blog.imageUrl ?
                    <Image src={blog.imageUrl} width={350} height={200} alt="www.ablogroom.com" style={{ width: "auto" }} priority
                        placeholder="blur"
                        blurDataURL={blog.imageUrl}
                    />
                    :
                    <Image src={logo} width={350} height={200} alt="www.ablogroom.com" style={{ width: "auto" }} priority
                        placeholder="blur"
                        blurDataURL={logo}
                    />
                }
                <p className="TWO">
                    {blog.content.slice(0, 75)},,,see detail
                </p>

                <div className="flex flex-row mx-auto gap-2">
                    <small className="mx-auto p-1">{blog.name}</small>
                    {blog && blog.date && <small className="mx-auto p-1">{getFormattedDate(blog.date)}</small>}
                </div>
            </Link>
            <button className={styles.btnUpdate} onClick={(e) => handleEdit(e, blog.id)}>edit</button>
        </div>
    )
}