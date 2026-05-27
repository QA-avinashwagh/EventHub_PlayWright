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
            throw new Error("Unable to create event")
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


test("@api-booking should be able to retrieve booking by reference id", async ({ eventService, bookingService }) => {

    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unable to create event")
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

        if (bookingResponse.status !== 201) {
            throw new Error(`Event booking is not successfull for event: ${eventId}`);
        }

        const referenceId = bookingResponse.body.data.bookingRef;

        const getResponse = await bookingService.getBookingByRefId(referenceId);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.success).toBeTruthy();

    } finally {
        await cleanupEvent(eventService, eventId);
    }
});


test("@api-booking create booking with zero tickets count", async ({ eventService, bookingService }) => {
    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unable to create event")
        }

        eventId = eventResponse.body.data.id;
        const bookingPayload = generateBookingPayload(eventId, 0);

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

        if (bookingResponse.status === 400) {
            expect(bookingResponse.body.success).toBeFalsy();
            expect(bookingResponse.body.error).toBe("Validation failed");
            expect(bookingResponse.body.details.at(0)?.message).toBe("Quantity must be an integer between 1 and 10")
        }

    } finally {
        await cleanupEvent(eventService, eventId);
    }
});

test("@api-booking create booking with max count +1", async ({ bookingService, eventService }) => {

    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unable to create event")
        }

        eventId = eventResponse.body.data.id;
        const bookingPayload = generateBookingPayload(eventId, 11);

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

        expect(bookingResponse.status).toBe(400);

        if (bookingResponse.status === 400) {
            expect(bookingResponse.body.success).toBeFalsy();
            expect(bookingResponse.body.error).toBe("Validation failed");
            expect(bookingResponse.body.details.at(0)?.message).toBe("Quantity must be an integer between 1 and 10")
        }

    } finally {
        await cleanupEvent(eventService, eventId);
    }
});


test("@api-booking should be able to book event with max ticket count 10", async ({ eventService, bookingService }) => {

    let eventId: number | undefined;
    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unable to create event")
        }

        eventId = eventResponse.body.data.id;
        const seatsCount = eventResponse.body.data.totalSeats;
        const seatPerPrice = eventResponse.body.data.price;
        const bookingPayload = generateBookingPayload(eventId, 10);

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
            expect(Number(bookingResponse.body.data.totalPrice)).toBe(seatPerPrice * 10);
        }

        expect(updatedCount).toBe(seatsCount - 10);

    } finally {
        await cleanupEvent(eventService, eventId);
    }

})

test("@api-booking should be able to cancel the booking", async ({ eventService, bookingService }) => {

    let eventId: number | undefined

    try {
        const { eventResponse } = await CreateEventByApi(eventService);

        if (eventResponse.status !== 201) {
            throw new Error("Unable to create event")
        }
        expect(eventResponse.status).toBe(201)

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

        expect(bookingResponse.status).toBe(201);
        if (bookingResponse.status !== 201) {
            throw new Error(`Booking creation failed on event :${eventId}`);
        };

        expect(bookingResponse.body.success).toBeTruthy();
        expect(bookingResponse.body.message).toBe("Booking confirmed!");

        const bookingId = bookingResponse.body.data.id
        const deleteResponse = await bookingService.deleteBooking(bookingId);

        if (deleteResponse.status !== 200) {
            throw new Error(`Unable to cancel the ticker for event :${eventId}`);
        }

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Booking cancelled");

    } finally {
        await cleanupEvent(eventService, eventId);
    }

})