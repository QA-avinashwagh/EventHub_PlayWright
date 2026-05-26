import { BookingClient } from "../clients/EventBookingClient";
import { BookingEventRefQuery } from "../models/request/BookingEventRefQuery";
import { CreateBookingRequest } from "../models/request/CreateBookingRequest";
import { DeleteBookingReq } from "../models/request/DeleteBookingReq";
import { GetAllEventBookingQuery } from "../models/request/GetAllEventBookingQuery";
import { ApiErrorResponse } from "../models/response/ApiErrorResponse";
import { BookingValidationErrorRsponse } from "../models/response/BookingValidationErrorResponse";
import { CreateBookingApiResponse } from "../models/response/CreateBookingApiResponse";
import { CreateBookingResponse } from "../models/response/CreateBookingResponse";
import { GetAllBookingEvent } from "../models/response/GetAllBookingEvent";
import { GetAllBookingEventApiResponse } from "../models/response/GetAllBookingEventApiResponse";
import { GetBookingByRefIdApiResponse } from "../models/response/GetBookingByRefIdApiResponse";
import { DeleteEventSuccessResponse } from "../models/response/DeleteEventSucessResponse";
import { DeleteEventApiResponse } from "../models/response/DeleteEventApiResponse";

export class EventBookingService {

    private bookingClient: BookingClient

    constructor(bookingClient: BookingClient) {
        this.bookingClient = bookingClient;
    }

    async getAllBookingEventById(getAllEventBookingQuery: GetAllEventBookingQuery): Promise<GetAllBookingEventApiResponse> {

        const response = await this.bookingClient.getAllBookingsByEventId(getAllEventBookingQuery);

        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as GetAllBookingEvent
            }
        } else if (status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }

    async createEventBookingById(bookingData: CreateBookingRequest): Promise<CreateBookingApiResponse> {

        const response = await this.bookingClient.createBookingByEventId(bookingData);

        console.log(response.status());
        const status = response.status();

        if (status === 201) {
            return {
                status,
                body: await response.json() as CreateBookingResponse
            }
        } else if (status === 400) {
            return {
                status,
                body: await response.json() as BookingValidationErrorRsponse
            }
        } else if (status === 401 || status === 404 || status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }


    async getBookingByRefId(refQuery : BookingEventRefQuery) : Promise <GetBookingByRefIdApiResponse>{

        const response = await this.bookingClient.getBookingByRefId(refQuery);

        const status = response.status();

        if (status === 200){
            return{
                status, 
                body : await response.json() as CreateBookingResponse
            }
        }else if (status === 401 || status === 404 || status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        }
    }

    async deleteBookingById(payload : DeleteBookingReq): Promise<DeleteEventApiResponse>{

        const response = await this.bookingClient.deleteBookingById(payload)

        const status = response.status();

        if (status === 200){
            return{
                status, 
                body : await response.json() as DeleteEventSuccessResponse
            }
        }else if (status === 401 || status === 404 || status === 500) {
            return {
                status,
                body: await response.json() as ApiErrorResponse
            }
        } else {
            throw new Error(`Unexpected status code: ${status}`);
        } 
    }


    
}