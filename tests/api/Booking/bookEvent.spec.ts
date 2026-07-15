    import { expect, test } from "../../../fixtures/ApiFixture";
    import { generateBookingPayload } from "../../../utils/factories/bookingFactory";

    test('@api-booking should be able to book default event successfully', async ({ bookingService }) => {

        // using default event as to create booking 
        const bookingPayload = generateBookingPayload(2, 1);

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

    test("@api-booking should be able to book newly created event ", async ({ eventResource, eventService, bookingService }) => {

        const eventId = eventResource.id;
        const seatsCount = eventResource.totalSeats;

        const bookingPayload = generateBookingPayload(eventId, 1);

        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        expect(bookingResponse.status).toBe(201);
        if (bookingResponse.status === 201) {
            expect(bookingResponse.body.success).toBeTruthy();
            expect(bookingResponse.body.message).toBe("Booking confirmed!");
        }

        const getResponse = await eventService.getEvent(eventId);
        if (getResponse.status !== 200) {
            throw new Error("Failed get update seat count from get API");
        }

        const updatedCount = getResponse.body.data.availableSeats;

        expect(updatedCount).toBe(seatsCount - 1);
    });


    test("@api-booking should be able to retrieve booking by reference id", async ({ eventResource, bookingService }) => {

        const eventId = eventResource.id;

        const bookingPayload = generateBookingPayload(eventId, 1);
        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);
        await test.info().attach("Create booking Response",
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
    });


    test("@api-booking create booking with zero tickets count", async ({ eventResource, bookingService }) => {

        const eventId = eventResource.id;
        const bookingPayload = generateBookingPayload(eventId, 0);

        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        expect(bookingResponse.status).toBe(400);
        if (bookingResponse.status === 400) {
            expect(bookingResponse.body.success).toBeFalsy();
            expect(bookingResponse.body.error).toBe("Validation failed");
            expect(bookingResponse.body.details[0].message).toBe("Quantity must be an integer between 1 and 10")
        }
    });

    test("@api-booking create booking with max count +1", async ({ bookingService, eventResource }) => {

        const eventId = eventResource.id;
        const bookingPayload = generateBookingPayload(eventId, 11);

        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        expect(bookingResponse.status).toBe(400);

        if (bookingResponse.status === 400) {
            expect(bookingResponse.body.success).toBeFalsy();
            expect(bookingResponse.body.error).toBe("Validation failed");
            expect(bookingResponse.body.details[0].message).toBe("Quantity must be an integer between 1 and 10")
        }
    });


    test("@api-booking should be able to book event with max ticket count 10", async ({ eventResource, eventService, bookingService }) => {

        const eventId = eventResource.id;
        const seatsCount = eventResource.totalSeats;
        const seatPerPrice = eventResource.price;
        const bookingPayload = generateBookingPayload(eventId, 10);

        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        expect(bookingResponse.status).toBe(201);
        if (bookingResponse.status === 201) {
            expect(bookingResponse.body.success).toBeTruthy();
            expect(bookingResponse.body.message).toBe("Booking confirmed!");
            expect(Number(bookingResponse.body.data.totalPrice)).toBe(seatPerPrice * 10);
        }
        const getResponse = await eventService.getEvent(eventId);
        if (getResponse.status !== 200) {
            throw new Error("Failed get update seat count from get API");
        }

        const updatedCount = getResponse.body.data.availableSeats;
        expect(updatedCount).toBe(seatsCount - 10);
    })

    test("@api-booking should be able to cancel the booking and restroe seats", async ({ eventService, eventResource, bookingService }) => {

        const eventId = eventResource.id;
        const seatsCount = eventResource.totalSeats;

        const bookingPayload = generateBookingPayload(eventId, 1);
        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);
        await test.info().attach("Create booking Response",
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

        const getResponse = await eventService.getEvent(eventId);
        if (getResponse.status !== 200) {
            throw new Error("Failed get update seat count from get API");
        }

        const updatedCount = getResponse.body.data.availableSeats;
        expect(updatedCount).toBe(seatsCount - 1);

        const bookingId = bookingResponse.body.data.id
        const deleteResponse = await bookingService.deleteBooking(bookingId);
        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(deleteResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        if (deleteResponse.status !== 200) {
            throw new Error(`Unable to cancel the ticker for event :${eventId}`);
        }

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Booking cancelled");

        const getResponse2 = await eventService.getEvent(eventId);
        if (getResponse2.status !== 200) {
            throw new Error("Failed get restore seat count from get API");
        }

        const restoreSeatCount = getResponse2.body.data.availableSeats;
        expect(seatsCount).toBe(restoreSeatCount)
    })


    test("@api-booking should not able to book event on unknown event", async ({ bookingService }) => {

        const eventId = 24525;
        const bookingPayload = generateBookingPayload(eventId, 2);

        await test.info().attach("Create booking payload",
            {
                body: JSON.stringify(bookingPayload, null, 2),
                contentType: "application/json"
            }
        );

        const bookingResponse = await bookingService.createBooking(bookingPayload);

        await test.info().attach("Create booking Response",
            {
                body: JSON.stringify(bookingResponse.body, null, 2),
                contentType: "application/json"
            }
        );

        expect(bookingResponse.status).toBe(404);

        if (bookingResponse.status === 404) {
            expect(bookingResponse.body.success).toBeFalsy();
            expect(bookingResponse.body.error).toBe(`Event with id ${eventId} not found`);
        }
    })

    test("should return 401 for invalid token", async ({unauthorizedBookingService, eventResource}) => {

        const payload = generateBookingPayload(eventResource.id, 1);

        const response = await unauthorizedBookingService.createBooking(payload);

        expect(response.status).toBe(401);
    }
    );

