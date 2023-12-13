import { MetadataRoute } from 'next';
import { genArr } from "./prepsitemap";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const getGenArr = await genArr();
  return getGenArr
}