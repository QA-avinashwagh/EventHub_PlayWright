import { validateHeaderName } from "node:http";
import { test, expect } from "../../../fixtures/ApiFixture";
import user from "../../../test_data/bookingUserDetails.json"

test("@API-Mocking should display empty state illustration when list is empty", async ({ authSetup, page, myBookingPage }) => {

    await page.route('**api/bookings*', async (route) => {

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0
                }
            }),
        });
    });

    await myBookingPage.goTo();
    await expect(myBookingPage.noBookingHeading).toBeVisible();
    await expect(myBookingPage.noBookingMessage).toBeVisible();
})

test('@API-Mocking should display an error when API gets failed', async ({ authSetup, page, myBookingPage }) => {

    await page.route('**api/bookings*', async (route) => {

        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                "success": false,
                "error": "Resource not found"
            }),
        });
    });

    await myBookingPage.goTo();
    await expect (myBookingPage.headingFailToLoadMessage).toBeVisible();
    await expect(myBookingPage.failToConnectMessage).toBeVisible();
    await expect (myBookingPage.retryButton).toBeVisible();
})

test('@API-Mocking should be able to book mock event displaye in the event ', async ({ authSetup, page, eventPage, createEventPage,eventDetailPage, myBookingPage }) => {

    page.on('request', request => {
    console.log(
        request.method(),
        request.url()
    );
});
validateHeaderName

    await page.route('**/api/events*', async (route) => {

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                data: [{
                    id: 1,
                    title: "Mock Summit 2026",
                    description: "A premier technology conference bringing together industry leaders.",
                    category: "Conference",
                    venue: "Bangalore International Centre",
                    city: "Bangalore",
                    eventDate: "2026-06-15T09:00:00.000Z",
                    price: 1500,
                    totalSeats: 500,
                    availableSeats: 342,
                    imageUrl: "https://example.com/images/tech-summit.jpg",
                    createdAt: "2026-06-04T04:22:25.091Z",
                    updatedAt: "2026-06-04T04:22:25.091Z"
                }],
                pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            }),
        });
    });

    await eventPage.goTo();
    const mockEvent = eventPage.findEvent("Mock Summit 2026");
    await expect(mockEvent.root).toBeVisible();

    await mockEvent.book();
    const bookingForm = eventDetailPage.bookingForm(); 
    await expect(bookingForm.root).toBeVisible();
    await bookingForm.book(user.Details.davidUser.fullName, user.Details.davidUser.email, user.Details.davidUser.phoneNumber);

    await page.route('**/api/bookings*', async (route) => {

        const requestBody = route.request().postDataJSON();
        console.log('BOOKING API INTERCEPTED');
        console.log(requestBody);

        await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                data: {
                    id: 1,
                    eventId: 3,
                    customerName: requestBody.customerName,
                    customerEmail: requestBody.customerEmail,
                    customerPhone: requestBody.customerPhone,
                    quantity: 2,
                    totalPrice: 3000,
                    status: "confirmed",
                    bookingRef: "MCK-A1B2C3",
                    createdAt: "2026-06-04T04:24:25.091Z",
                    updatedAt: "2026-06-04T04:24:25.091Z",
                    event: {
                        id: 1,
                        title: "Mock Summit 2026",
                        description: "A premier technology conference bringing together industry leaders.",
                        category: "Conference",
                        venue: "Bangalore International Centre",
                        city: "Bangalore",
                        eventDate: "2026-06-15T09:00:00.000Z",
                        price: 1500,
                        totalSeats: 500,
                        availableSeats: 342,
                        imageUrl: "https://example.com/images/tech-summit.jpg",
                        createdAt: "2026-06-04T04:22:25.091Z",
                        updatedAt: "2026-06-04T04:22:25.091Z"
                    }
                },
                message: "Booking confirmed!"
            }),
        });
    });

    await bookingForm.confirmBooking();

    await expect(bookingForm.bookingConfirmMessage).toBeVisible();
    const refId = await bookingForm.getBookingRefId();

    await page.route('**api/bookings*', async (route) => {

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                data: [{
                    id: 1,
                    eventId: 3,
                    customerName: user.Details.davidUser.fullName,
                    customerEmail: user.Details.davidUser.email,
                    customerPhone: user.Details.davidUser.phoneNumber,
                    quantity: 2,
                    totalPrice: 3000,
                    status: "confirmed",
                    bookingRef: "MCK-A1B2C3",
                    createdAt: "2026-06-04T04:24:25.091Z",
                    updatedAt: "2026-06-04T04:24:25.091Z",
                    event: {
                        id: 1,
                        title: "Mock Summit 2026",
                        description: "A premier technology conference bringing together industry leaders.",
                        category: "Conference",
                        venue: "Bangalore International Centre",
                        city: "Bangalore",
                        eventDate: "2026-06-15T09:00:00.000Z",
                        price: 1500,
                        totalSeats: 500,
                        availableSeats: 342,
                        imageUrl: "https://example.com/images/tech-summit.jpg",
                        createdAt: "2026-06-04T04:22:25.091Z",
                        updatedAt: "2026-06-04T04:22:25.091Z"
                    }
                }],
                pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            }),
        });
    });

    await bookingForm.viewBooking();

    await expect(myBookingPage.findBooking(refId).root).toBeVisible();
})

test('@API-Mocking should be able to mock seat count and verify the behavoiur', async ({ authSetup, page, eventPage }) => {

    await page.route('**/api/events*', async (route) => {

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: true,
                data: [{
                    id: 1,
                    title: "Mock Summit 2026",
                    description: "A premier technology conference bringing together industry leaders.",
                    category: "Conference",
                    venue: "Bangalore International Centre",
                    city: "Bangalore",
                    eventDate: "2026-06-15T09:00:00.000Z",
                    price: 1500,
                    totalSeats: 100,
                    availableSeats: 0,
                    imageUrl: "https://example.com/images/tech-summit.jpg",
                    createdAt: "2026-06-04T04:22:25.091Z",
                    updatedAt: "2026-06-04T04:22:25.091Z"
                }],
                pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            }),
        });
    });

    await eventPage.goTo();
    const event = eventPage.findEvent("Mock Summit 2026");
    await expect(event.root).toBeVisible();
    await expect (event.soldOutText).toBeVisible(); 
    await expect(event.soldOutButton).toBeVisible();

});