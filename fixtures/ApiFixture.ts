import { test as base, expect } from "../fixtures/baseFixture";
import { AuthClient } from "../api/clients/AuthClient";
import { AuthService } from "../api/services/AuthService";
import user from "../test_data/loginUser.json";
import { EventService } from "../api/services/EventService";
import { EventClient } from "../api/clients/EventClient";
import { EventBookingService } from "../api/services/EventBookingService";
import { BookingClient } from "../api/clients/EventBookingClient";

type Apifixture = {

    authToken: string;
    eventService: EventService;
    bookingService : EventBookingService
}

export const test = base.extend<Apifixture>({

    authToken: async ({ request }, use) => {

        const authClient = new AuthClient(request);
        const authService = new AuthService(authClient);

        const response = await authService.login(user.validUser1.email, user.validUser1.password)

        await use(response.token);
    },

    eventService: async ({ request, authToken }, use) => {

        const eventClient = new EventClient(request, authToken);

        const eventService = new EventService(eventClient);

        await use(eventService);

    },

    bookingService : async({request, authToken}, use)=>{

        const bookingClient = new BookingClient(request, authToken);
        const bookingService = new EventBookingService(bookingClient);

        await use(bookingService);
    }

})

export { expect }; 