export interface BookingValidationErrorRsponse{

    success : false,
    error : string,
    details : [
        {
            field : string, 
            message : string
        }
    ]

}