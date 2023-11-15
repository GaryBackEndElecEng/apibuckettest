

type errorType = {
    error: { message: string }
}
export function getErrorMessage(error: unknown): string {
    let message: string;
    if (error instanceof Error) {
        message = error.message;

    } else if (error && typeof error === "object" && " message" in error) {
        message = JSON.stringify(error);
    } else if (typeof error === "string") {
        message = error;
    } else {
        message = " something went wrong"
    }
    return message
}