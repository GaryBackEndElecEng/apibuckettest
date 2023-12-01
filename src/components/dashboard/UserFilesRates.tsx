import { fileType, rateType, nameRateType, fileRateType } from '@/lib/Types'
import React from 'react';
import styles from "./dashboard.module.css";
import GenStars from "@component/comp/GenStars";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { filterSort, ArrRateFileResult } from "@lib/ultils"

export default function UserFilesRates({ files }: { files: fileType[] }) {

    return (

        <ShowRates files={files} />

    )
}

export function ShowRates({ files }: { files: fileType[] }) {
    let arr: nameRateType[] = [];

    const ArrRateRes = React.useCallback((): nameRateType[] => {
        return ArrRateFileResult(files)
    }, []);


    return (
        <div className={`${styles.showRatesMain} bg-slate-300`}>

            {ArrRateRes() && ArrRateRes().map((rate, index) => (
                <div key={index} className="flex justify-center items-center">
                    <div>{rate.name}</div>
                    <span><span className="text-red-800 mx-1">Av:</span>{rate.avRate}</span>
                    <span><span className="text-red-800 mx-1">#:</span>{rate.count}</span>
                </div>
            ))}
        </div>
    )
}

