

type errorType = {
    error: { message: string }
}
export function getErrorMessage(error: unknown): string | undefined {
    let message: string | undefined;
    if (error instanceof Error) {
        message = error.message;

    } else if (error && typeof error === "object" && " message" in error) {
        message = JSON.stringify(error);
    } else if (typeof error === "string") {
        message = error;
    } else if (!error) {
        message = undefined
    } else if (error && typeof Object) {
        message = JSON.stringify(error)
    }
    return message
}