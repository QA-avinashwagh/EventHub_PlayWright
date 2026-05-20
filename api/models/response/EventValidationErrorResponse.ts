export interface EventValidationError {

    success: false,
    error: string,
    details: [
        {
            field: string,
            message: string
        }
    ]


}