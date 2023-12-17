import { postType, userType } from '@/lib/Types'
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import UserPage from "@component/userpage/UserPage";
const url = process.env.BUCKET_URL as string;



type userPageType = {
    user: userType
}
export default async function MainUserPage({ user }: userPageType) {
    const checkPosts = user && user.posts && user.posts.length > 0 ? true : false;
    const posts: postType[] | undefined = checkPosts ? user.posts.map(post => {
        if (post.s3Key) {
            post.imageUrl = `${url}/${post.s3Key}`;
        }
        return post
    }) : undefined
    return (
        <div className={styles.mainUserpage}>
            <UserPage user={user} files={user.files} posts={posts} />
        </div>
    )
}




