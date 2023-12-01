"use client"
import React from 'react';
import type { blogLinkType, postType, userType } from "@lib/Types";
import EditPost from "@component/dashboard/editPost/EditPost";
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashSignup from '../DashSignup';

type MainEditType = {
  getpost: postType | undefined,
  getuser: userType,
  getblogLinks: blogLinkType[] | undefined
}

export default function MainEditPost({ getpost, getuser, getblogLinks }: MainEditType) {

  return (
    <EditPost
      getuser={getuser}
      getpost={getpost}
      getblogLinks={getblogLinks}
    />
  )

}
