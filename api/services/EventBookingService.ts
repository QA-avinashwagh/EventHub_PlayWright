import { BookingClient } from "../clients/BookingClient";
import { GetAllEventBookingQuery } from "../models/request/GetAllEventBookingQuery";
import { ApiErrorResponse } from "../models/response/ApiErrorResponse";
import { GetAllBookingEvent } from "../models/response/GetAllBookingEvent";
import { GetAllBookingEventApiResponse } from "../models/response/GetAllBookingEventApiResponse";

export class EventBookingService{

    private bookingClient : BookingClient

    constructor(bookingClient : BookingClient){
        this.bookingClient = bookingClient;
    }

    async getAllBookingEventById(getAllEventBookingQuery : GetAllEventBookingQuery): Promise <GetAllBookingEventApiResponse> {

        const response = await this.bookingClient.getAllBookingsByEventId(getAllEventBookingQuery); 

        const status =  response.status();

        if(status === 200){
            return {
                status, 
                body : await response.json() as GetAllBookingEvent
            }
        }else if (status === 500){
            return {
                status,
                body : await response.json() as ApiErrorResponse
            }
        }else {
             throw new Error(`Unexpected status code: ${status}`);
        }
    }


}