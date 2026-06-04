import { test, expect } from "../../../fixtures/ApiFixture";


test('@Api-Mocking should display empty state illustration when list is empty', async ({ authSetup, page, eventPage }) => {

    await page.route('**/api/events*', async (route) => {

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

    await eventPage.goTo();
    await expect(eventPage.noEventResult).toBeVisible();
    await expect(eventPage.addNewEventBtn).toBeVisible();
});


test('@Api-Mocking should display skeleton during a slow API response', async ({ authSetup, page, eventPage }) => {

    await page.route('**/api/events*', async (route) => {

        // creating delay in response for 3 sec
        await new Promise(resolve => setTimeout(resolve, 3000))

        //Fulling the response after 3 sec
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

    await eventPage.goTo();
    await expect(eventPage.loadingSkeleton.first()).toBeVisible();

    await expect(eventPage.loadingSkeleton.first()).toBeHidden({ timeout: 5000 });

    await expect(eventPage.noEventResult).toBeVisible();
    await expect(eventPage.addNewEventBtn).toBeVisible();
});


test('@API-Mocking should display an error when API gets failed', async ({ authSetup, page, eventPage }) => {

    await page.route('**/api/events*', async (route) => {

        await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({
                success: false,
                error: "Resource not found"
            }),
        });
    });

    await eventPage.goTo();
    await expect(eventPage.loadingSkeleton.first()).toBeVisible();
    await expect(eventPage.addNewEventBtn).toBeVisible();

})


test('@API-Mocking should display events mocked by API', async ({ authSetup, page, eventPage }) => {

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
    await expect(eventPage.getEventCard("Mock Summit 2026")).toBeVisible();
    await expect(eventPage.addNewEventBtn).toBeVisible();

})


test('@API-Mocking should be able to handle network interruption', async ({ authSetup, page, eventPage }) => {

    await page.route('**/api/events*', async (route) => {
        await route.abort('timedout');
    });

    await eventPage.goTo();
    await expect(eventPage.loadingSkeleton.first()).toBeVisible();
    await expect(eventPage.addNewEventBtn).toBeVisible();

})