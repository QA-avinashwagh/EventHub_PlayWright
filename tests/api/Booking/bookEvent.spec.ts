import { expect, test } from "../../../fixtures/ApiFixture";
import { cleanupEvent } from "../../../utils/CleanUpHelper";
import { CreateEventByApi } from "../../../utils/CreateEventHelperApi";
import { generateBookingPayload } from "../../../utils/factories/bookingFactory";


test('@api-booking should be able to book default event successfully', async ({ bookingService }) => {

    // using default event as to create booking 
    const bookingPayload = generateBookingPayload(1, 1);

    test.info().attach("Create booking payload",
        {
            body: JSON.stringify(bookingPayload, null, 2),
            contentType: "application/json"
        }
    );

    const response = await bookingService.createBooking(bookingPayload);

    test.info().attach("Create booking Response",
        {
            body: JSON.stringify(response.body, null, 2),
            contentType: "application/json"
        }
    );

    expect(response.status).toBe(201);

    if (response.status === 201) {
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe("Booking confirmed!");
    }
})

test("@api-booking should be able to book newly created event ", async ({ eventService, bookingService }) => {
    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unaable to create event")
        }

        eventId = eventResponse.body.data.id;
        const seatsCount = eventResponse.body.data.totalSeats;
        const bookingPayload = generateBookingPayload(eventId, 1);

        test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        const getResponse = await eventService.getEvent(eventId);
        if (getResponse.status !== 200) {
            throw new Error("Failed get update seat count from get API");
        }

        const updatedCount = getResponse.body.data.availableSeats;

        expect(bookingResponse.status).toBe(201);
        if (bookingResponse.status === 201) {
            expect(bookingResponse.body.success).toBeTruthy();
            expect(bookingResponse.body.message).toBe("Booking confirmed!");
        }

        expect(updatedCount).toBe(seatsCount - 1);
    } finally {
        await cleanupEvent(eventService, eventId);
    }
}); 


test("@api-booking should be able to reterive booking by reference id", async({eventService, bookingService})=>{

    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unaable to create event")
        }

        eventId = eventResponse.body.data.id;

        const bookingPayload = generateBookingPayload(eventId, 1);
        test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);
        test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        if (bookingResponse.status !==201){
            throw new Error(`Event booking is not successfull for event: ${eventId}`);
        }

       const refernceId =  bookingResponse.body.data.bookingRef;
       
       const getResponse = await bookingService.getBookingByRefId(refernceId);
        expect(getResponse.status).toBe(200); 
        expect(getResponse.body.success).toBeTruthy();

    } finally {
        await cleanupEvent(eventService, eventId);
    }
});


// test("@api-booking create booking with zero tickets count", async({eventService, bookingService})=>{
//     let eventId: number | undefined;
//     try {
//         const { eventResponse } = await CreateEventByApi(eventService);

//         if (eventResponse.status !== 201) {
//             throw new Error("Unaable to create event")
//         }

//         eventId = eventResponse.body.data.id;
//         const seatsCount = eventResponse.body.data.totalSeats;
//         const bookingPayload = generateBookingPayload(eventId, 0);

//         test.info().attach("Create booking payload",
//             {
//                 body: JSON.stringify(bookingPayload, null, 2),
//                 contentType: "application/json"
//             }
//         );

//         const bookingResponse = await bookingService.createBooking(bookingPayload);

//         test.info().attach("Create booking Response",
//             {
//                 body: JSON.stringify(bookingResponse.body, null, 2),
//                 contentType: "application/json"
//             }
//         );

//         const getResponse = await eventService.getEvent(eventId);
        
//         expect(getResponse.status).toBe(400);
//         if (getResponse.status === 400) {
//             expect(getResponse.body.success).toBeTruthy();
//             expect(bookingResponse.body.message).toBe("Booking confirmed!");
//         }

//         expect(updatedCount).toBe(seatsCount - 1);
//     } finally {
//         await cleanupEvent(eventService, eventId);
//     }


