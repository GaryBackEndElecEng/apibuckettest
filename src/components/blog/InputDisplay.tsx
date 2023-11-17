import { inputType } from '@/lib/Types'
import React from 'react'

export default function InputDisplay({ input }: { input: inputType }) {
    return (
        <>
            {input &&
                <div>
                    Input display
                </div>
            }
        </>
    )
}
