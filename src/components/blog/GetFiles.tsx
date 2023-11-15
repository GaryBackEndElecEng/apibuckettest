import React from 'react';
import type { fileType } from "@lib/Types";
import Image from "next/image";
import getFormattedDate from "@lib/getFormattedDate";

export default function GetFiles({ files }: { files: fileType[] }) {

    return (
        <div className="mx-auto flex flex-col items-center justify-center">
            {files &&
                files.map((file, index) => (
                    <React.Fragment key={index}>
                        <h3 className="text-center text-2xl mb-3">{file.title.toUpperCase()}</h3>
                        {file.imageUrl && <Image src={file.imageUrl} width={600} height={400} alt={"www"} className="aspect-video" />}
                        <p className="mx-auto px-3 my-2">{file.content}</p>
                        <div className="flex flex-row gap-2 mx-auto rounded-xl shadow shadow-orange-800 border-orange-400 px-2 py-1 mt-3">
                            {file.date && <small className="text-sm text-center">{getFormattedDate(file.date)}</small>}
                            <small className="text-center text-sm">{file.name}</small>
                        </div>
                    </React.Fragment>
                ))
            }
        </div>
    )
}

