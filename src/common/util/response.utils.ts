export const ResponseData = (
    statusCode: number,
    message: string,
    content: any
) => {
    return {
        statusCode,
        message,
        content,
        timestamp: new Date()
    }
}