export interface GetEventSuccess {

success: true,
    data: {
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
        userId : number, 
        createdAt: string,
        updatedAt: string
    }


}