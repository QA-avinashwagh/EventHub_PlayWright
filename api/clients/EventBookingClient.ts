import { APIRequestContext, APIResponse } from "@playwright/test";
import { GetAllEventBookingQuery } from "../models/Booking/request/GetAllEventBookingQuery";
import { API_BASE_URL } from "../../config/env";
import { CreateBookingRequest } from "../models/Booking/request/CreateBookingRequest";

const API_URL = `${API_BASE_URL}/api/bookings`;
export class BookingClient {

    private request: APIRequestContext;
    private token: string;

    constructor(request: APIRequestContext, token: string) {
        this.request = request;
        this.token = token;
    }

    async getAllBookings(getAllEventBookingQuery: GetAllEventBookingQuery): Promise<APIResponse> {

        return await this.request.get(API_URL, {
            params: {
                ...getAllEventBookingQuery
            },
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        })
    }

    async createBooking(payload: CreateBookingRequest): Promise<APIResponse> {

        return await this.request.post(API_URL, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            data: payload
        });
    }

    async getBookingByRefId(refId: string): Promise<APIResponse> {

        return await this.request.get(`${API_URL}/ref/` + refId, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
        })
    }

    async deleteBooking(id: number): Promise<APIResponse> {

        return await this.request.delete(`${API_URL}/` + id, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            }
        })
    }


}