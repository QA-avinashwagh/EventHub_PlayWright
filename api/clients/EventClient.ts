import { APIRequestContext, APIResponse } from "@playwright/test";
import { CreateEventRequest } from "../models/CreateEventRequest";
import { API_BASE_URL } from "../../config/env";


const API_URL = `${API_BASE_URL}/api/events`;

export class EventClient{

    private request : APIRequestContext
    private token : string;
   
    constructor(request : APIRequestContext, token :string){
        this.request = request;
        this.token = token;
    }

    async createEvent(payload : CreateEventRequest) : Promise<APIResponse>{

        return await this.request.post(API_URL, {
            headers : {
                'Authorization' :`Bearer ${this.token}`, 
                'Content-Type' : 'application/json'
            }, 
            data :payload
        });

    }

}