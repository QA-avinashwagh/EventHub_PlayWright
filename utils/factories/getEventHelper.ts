import { EventService } from "../../api/services/eventService";

//Get id for created event using get all event - usage in clean up 

export async function getEventIdByTitle(eventService :EventService, 
                        city : string, search : string) : Promise<number | undefined>{

            const response = await eventService.getAllEvent({city, search});
            console.log(response);    

            if (response.status !== 200) {
               throw new Error(`Failed to fetch events.Status: ${response.status}`);
            }
        
            const createdEvent = response.body.data.find(event => event.title === search)
            return createdEvent?.id;   

        }