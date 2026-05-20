    import { APIRequestContext, APIResponse } from "@playwright/test";
    import {LoginRequest} from "../models/request/LoginRequest"
    import {API_BASE_URL} from "../../config/env"

    const API_URL = `${API_BASE_URL}/api/auth/login`;

    export class AuthClient{

        private request : APIRequestContext;
    
        constructor(request : APIRequestContext){
            this.request = request;
        }

        async login(payload : LoginRequest) : Promise<APIResponse>{

            return await this.request.post(API_URL,{
                data : payload
            });
        }

        


    }