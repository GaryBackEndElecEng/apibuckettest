import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';


export default function GenStars({ rate }: { rate: number | undefined }) {
    let arr: number[] = [1, 2, 3, 4, 5]

    const rateArr = [
        { id: 1, name: "full", icon: <StarIcon sx={{ color: "gold" }} /> },
        { id: 2, name: "half", icon: <StarHalfIcon sx={{ color: "gold" }} /> },
        { id: 3, name: "emty", icon: <StarOutlineIcon sx={{ color: "gold" }} /> },
    ]

    return (

        <React.Fragment>
            {rate && rate > 0 ?
                <div className="flexrowsm">
                    {
                        arr.slice(0, rate).map(num => (
                            <React.Fragment key={num}>
                                {rateArr[0].icon}
                            </React.Fragment>
                        ))
                    }{
                        arr.slice(rate, arr.length).map(num => (
                            <React.Fragment key={num}>
                                {rateArr[2].icon}
                            </React.Fragment>
                        ))
                    }
                </div>
                :
                <></>
            }
        </React.Fragment>

    )


}