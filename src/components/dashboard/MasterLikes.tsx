import { fileType, postType } from '@/lib/Types'
import React from 'react'
import AvgLikes from "./AvgLikes";

type mainMastType = {
    files: fileType[] | null,
    posts: postType[] | null
}
export default function MasterLikes({ files, posts }: mainMastType) {
    return (
        <div>
            <h2>Blogs</h2>
            {files && files.map((file, index) => {
                if (file.likes) {
                    return (
                        <div className={"flexrowsm"} key={index}>
                            <small>{file.name.trim().slice(0, 20)}...</small>
                            <AvgLikes likes={file.likes} />
                        </div>
                    )
                }
            })
            }
            <h2>posts</h2>
            {posts && posts.map((post, index) => {
                if (post.likes) {
                    return (
                        <div className={"flexrowsm"} key={index}>
                            <small>{post.name.trim().slice(0, 20)}...</small>
                            <AvgLikes likes={post.likes} />
                        </div>
                    )
                }
            })
            }
        </div>
    )
}
