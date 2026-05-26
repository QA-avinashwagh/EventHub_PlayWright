import { BookingClient } from "../clients/EventBookingClient";
import { BookingEventRefQuery } from "../models/Booking/request/BookingEventRefQuery";
import { CreateBookingRequest } from "../models/Event/request/CreateBookingRequest";
import { GetAllEventBookingQuery } from "../models/Booking/request/GetAllEventBookingQuery";
import { ApiErrorResponse } from "../models/Common/ApiErrorResponse";
import { BookingValidationErrorRsponse } from "../models/Booking/response/BookingValidationErrorResponse";
import { CreateBookingApiResponse } from "../models/Booking/response/CreateBookingApiResponse";
import { CreateBookingResponse } from "../models/Booking/response/CreateBookingResponse";
import { GetAllBookingEvent } from "../models/Booking/response/GetAllBookingEvent";
import { GetAllBookingEventApiResponse } from "../models/Booking/response/GetAllBookingEventApiResponse";
import { GetBookingByRefIdApiResponse } from "../models/Booking/response/GetBookingByRefIdApiResponse";
import { GetBookingByRefIdSuccess } from "../models/Booking/response/GetBookingByRefIdSuccess";
import { DeleteBookingApiResponse } from "../models/Booking/response/DeleteBookingApiResponse";
import { DeleteBookingSuccessResponse } from "../models/Booking/response/DeletebookingSuccessResponse";

export class EventBookingService {

    private bookingClient: BookingClient

    constructor(bookingClient: BookingClient) {
        this.bookingClient = bookingClient;
    }

    async getBookingsByEvent(getAllEventBookingQuery: GetAllEventBookingQuery): Promise<GetAllBookingEventApiResponse> {

        const response = await this.bookingClient.getAllBookings(getAllEventBookingQuery);
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

    async createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingApiResponse> {

        const response = await this.bookingClient.createBooking(bookingData);
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


    async getBookingByRefId(refQuery: BookingEventRefQuery): Promise<GetBookingByRefIdApiResponse> {

        const response = await this.bookingClient.getBookingByRefId(refQuery);
        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as GetBookingByRefIdSuccess
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

    async deleteBooking(id: number): Promise<DeleteBookingApiResponse> {

        const response = await this.bookingClient.deleteBooking(id);
        const status = response.status();

        if (status === 200) {
            return {
                status,
                body: await response.json() as DeleteBookingSuccessResponse
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



}