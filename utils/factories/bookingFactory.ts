import { CreateBookingRequest } from "../../api/models/Booking/request/CreateBookingRequest";



export function generateBookingPayload(eventId : number, qunatity :number) :

        CreateBookingRequest{

            return {

                eventId : eventId,
                customerName :"Alexa Parker",
                customerEmail : "alexa.event@yopmail.com",
                customerPhone : "+91 9106162016", 
                quantity : qunatity
            };


        }