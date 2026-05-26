export interface GetAllEventsSuccessResponse {

    success: true;

    data: {

        id: number;
        title: string;
        description: string;
        category: string;
        venue: string;
        city: string;
        eventDate: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        imageUrl: string;
        createdAt: string;
        updatedAt: string;

    }[];

    pagination: {

        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}