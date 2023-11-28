"use client"
import React from 'react';
import type { postType } from "@lib/Types";
import EditPost from "@component/dashboard/editPost/EditPost";
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function MainEditPost() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : null;
  if (id && status === "authenticated") {
    return (
      <EditPost
        id={id}
      />
    )
  } else if (!id && status === "authenticated") {
    redirect("/dashboard")
  } else {
    redirect("/")
  }
}
