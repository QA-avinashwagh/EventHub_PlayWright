export interface CreateBookingResponse {

    success: boolean,
    data: {
        id: number;
        eventId: number;
        userId: number;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        quantity: number;
        totalPrice: number;
        status: 'confirmed' | 'pending' | 'cancelled'; // String union type for safety
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
    },
    message: string;

}