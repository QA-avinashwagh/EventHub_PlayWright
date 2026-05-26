import { APIRequestContext, APIResponse } from "@playwright/test";
import { GetAllEventBookingQuery } from "../models/request/GetAllEventBookingQuery";
import { API_BASE_URL } from "../../config/env";
import { CreateBookingRequest } from "../models/request/CreateBookingRequest";
import { BookingEventRefQuery } from "../models/request/BookingEventRefQuery";
import { DeleteBookingReq } from "../models/request/DeleteBookingReq";

const API_URL = `${API_BASE_URL}/api/events`;

export class BookingClient {

    private request : APIRequestContext;
    private token : string;

    constructor(request : APIRequestContext, token :string){
        this.request = request;
        this.token = token;
    }

    async getAllBookingsByEventId(getAllEventBookingQuery : GetAllEventBookingQuery){

        return await this.request.get(API_URL, {
            params : {
                ...getAllEventBookingQuery
            },
            headers :{
                'Authorization' : `Bearer ${this.token}`
            }
        })
    }

    async createBookingByEventId(payload : CreateBookingRequest) : Promise<APIResponse>{

        return await this.request.post(API_URL, {
            headers:{
                'Authorization' : `Bearar ${this.token}`,
                'Content-Type' : 'application/json' 
            }, 
            data :payload
        });
    }

    async getBookingByRefId(bookingRefQuery :BookingEventRefQuery): Promise<APIResponse>{

        return await this.request.get(API_URL, {
            params: {
                ...bookingRefQuery
            }, 
            headers:{
                'Authorization' : 'application/json'
            }
        })
    }

    async deleteBookingById(payload : DeleteBookingReq): Promise<APIResponse>{

        return await this.request.delete(API_URL, {
            headers:{
                'Authorization' : `Bearar ${this.token}`,
                'Content-Type' : 'application/json' 
            }, 
            data :payload
        })
    }


}