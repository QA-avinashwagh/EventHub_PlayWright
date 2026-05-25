export interface GetAllBookingEvent {
    "success": true,
    "data": [
        {
            id: number;
            eventId: number;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
            quantity: number;
            totalPrice: number;
            status: 'confirmed' | 'pending' | 'cancelled';
            bookingRef: string;
            createdAt: string; // ISO Date string
            updatedAt: string;
            event: {
                id: number,
                title: string,
                description: string
                category: string,
                venue: string,
                city: string,
                eventDate: string,
                price: number,
                totalSeats: number,
                availableSeats: number,
                imageUrl: string,
                isStatic: false,
                userId: number,
                createdAt: string,
                updatedAt: string
            }
        }
    ],
    pagination: {

        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }

}