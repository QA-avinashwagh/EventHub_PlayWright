export interface LoginSuccessResponse {

    success : true,
    token : string, 
    user : {
        id : number, 
        email :string
    }
}