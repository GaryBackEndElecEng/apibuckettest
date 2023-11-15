'use client' // Error components must be Client Components

import { useEffect, useContext } from 'react';
import { GeneralContext } from "@context/GeneralContextProvider";
import { getErrorMessage } from "@lib/errorBoundaries"


export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { setGetError } = useContext(GeneralContext)
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
        setGetError(getErrorMessage(error))
    }, [error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button
                className="buttonmd"
                onClick={
                    // Attempt to recover by trying to re-render the segment

                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}