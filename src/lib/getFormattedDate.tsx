
export default function getFormattedDate(date: Date): string {

    const date_: Date = date as Date
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(date_))

}