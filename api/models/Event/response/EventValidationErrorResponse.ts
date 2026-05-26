export interface EventValidationErrorResponse {

    success: false,
    error: string,
    details: [
        {
            field: string,
            message: string
        }
    ]


}