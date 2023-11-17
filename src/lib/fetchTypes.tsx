import axios from "axios";
import { getErrorMessage } from "@lib/errorBoundaries";
import type { pageHitType } from "@lib/Types";

export async function sendPageHit(pageHit: pageHitType) {
    try {
        const { data } = await axios.post(`/api/pagehit`, pageHit);
        const body: pageHitType = data;
        return body
    } catch (error) {
        let message: string = `${getErrorMessage(error)}@api/page-hit`
        console.error(message)
    }
}
export async function getPageHits() {
    try {
        const { data } = await axios.get(`/api/pagehit`);
        const body: pageHitType[] = data;
        return body
    } catch (error) {
        let message: string = `${getErrorMessage(error)}@api/page-hit`
        console.error(message)
    }
}