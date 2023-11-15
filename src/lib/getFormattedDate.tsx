
export default function getFormattedDate(date: Date): string {

    const date_: Date = new Date(date)
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date_)

}