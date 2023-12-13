import { postType, userType } from '@/lib/Types'
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import UserPage from "@component/userpage/UserPage";




type userPageType = {
    user: userType
}
export default async function MainUserPage({ user }: userPageType) {
    const posts: postType[] = user.posts;
    return (
        <div className={styles.mainUserpage}>
            <UserPage user={user} files={user.files} posts={posts} />
        </div>
    )
}




