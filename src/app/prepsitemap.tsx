import { navList } from "@context/navList";
import { MetadataRoute } from 'next';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type promiseType = {
    url: string,
    lastModified: Date,
    changeFrequency: string,
    priority: number
}
export async function genArr(): Promise<MetadataRoute.Sitemap> {
    const site = (process.env.NODE_ENV === 'production') ? "https://www.ablogroom.com" : "http://localhost:3000";
    let arr: MetadataRoute.Sitemap = [];
    const allLinks = await combined();
    allLinks.forEach((url) => {
        arr.push({ url: `${site}${url.url}`, lastModified: new Date(), changeFrequency: "always", priority: 1 });
    });

    return arr
}

export async function getPostUrls() {
    const posts = await prisma.post.findMany();
    return posts?.map(post => ({ url: `/posts/${post.id}` }))
}
export async function getFileUrls() {
    const files = await prisma.file.findMany();
    return files?.map(file => ({ url: `/blogs/${file.id}` }))
}
export async function combined() {
    let arr: { url: string }[] = [];
    const posts = await getPostUrls();
    const files = await getFileUrls();
    const navlinks = navList.map(nav => ({ url: nav.link }));
    arr = navlinks;
    arr = arr.concat(posts);
    arr = arr.concat(files);
    return arr
}