import { APIRequestContext, APIResponse } from "@playwright/test";
import { CreateEventRequest } from "../models/request/CreateEventRequest";
import { API_BASE_URL } from "../../config/env";
import { GetEventQuery } from "../models/request/GetEventQuery";


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

    async getEvent(id: number) : Promise<APIResponse>{

        return await this.request.get(`${API_URL}/`+id, {
            headers:{
                'Authorization' :`Bearer ${this.token}`
            }, 

        })
    }

    async getAllEvent(query?: GetEventQuery) : Promise<APIResponse>{

        return await this.request.get(`${API_URL}`, {
            params :{
                      ...query   
            }, 
            headers : {
                'Authorization' : `Bearer ${this.token}`
            } 
        })

    }

    async updateEvent(id: number, payload : CreateEventRequest) : Promise<APIResponse>{

        return await this.request.put(`${API_URL}/`+id, {
            headers:{
                'Authorization' :`Bearer ${this.token}`
            }, 

            data : payload
        }) 

    }

    async deleteEvent(id: number) : Promise<APIResponse>{

        return await this.request.delete(`${API_URL}/`+id, {
            headers:{
                'Authorization' :`Bearer ${this.token}`
            }, 

        })
    }

}