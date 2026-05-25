import { APIRequestContext } from "@playwright/test";
import { GetAllEventBookingQuery } from "../models/request/GetAllEventBookingQuery";
import { API_BASE_URL } from "../../config/env";

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





























}