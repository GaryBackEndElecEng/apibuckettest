import { postType, userType } from '@/lib/Types'
import React from 'react';
import UserProfile from "@component/post/UserProfile";
import "@pages/globalsTwo.css";
import Image from 'next/image';
import PostRatesLikes from '@component/post/PostRatesLikes';


export default function PostItem({ post, user }: { post: postType, user: userType }) {
    return (
        <div className="container">
            <h2>{post.name}</h2>
            {post.imageUrl &&
                <Image src={post.imageUrl} width={900} height={600}
                    alt={post.name}
                    className="image" />
            }
            <p>{post.content}</p>
            <div className="line-break-sm" />
            <UserProfile user={user} />
            <div className="line-break-sm" />
            <PostRatesLikes rates={post.rates} likes={post.likes} postId={post.id} />
            <div className="line-break-sm" />
        </div>
    )
}