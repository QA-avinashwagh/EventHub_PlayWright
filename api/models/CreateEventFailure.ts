export interface CreateEventFailure {

    success: false,
    error: string,
    details: [
        {
            field: string,
            message: string
        }
    ]


}