import { fileType, rateType, nameRateType, fileRateType } from '@/lib/Types'
import React from 'react';
import styles from "./dashboard.module.css";
import GenStars from "@component/comp/GenStars";
import { getErrorMessage } from '@/lib/errorBoundaries';

export default function UserFilesRates({ files }: { files: fileType[] }) {

    return (

        <ShowRates files={files} />

    )
}

export function ShowRates({ files }: { files: fileType[] }) {
    let arr: nameRateType[] = [];

    const ArrRateRes = React.useCallback((): nameRateType[] => {
        files.map((file, index) => {
            const len = file.rates && file.rates.length > 0 ? file.rates.length : 1;
            const calcAv = file.rates.reduce((a, b) => (a + b.rate), 0);
            const rateAv = Math.round(calcAv / len)
            arr.push({ name: file.name, avRate: rateAv, count: len });
            return
        })
        return arr
    }, []);


    return (
        <div className={`${styles.showRatesMain} bg-slate-300`}>
            <h3 className="text-lg text-center font-bold my-2 mx-auto">file rates</h3>
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

