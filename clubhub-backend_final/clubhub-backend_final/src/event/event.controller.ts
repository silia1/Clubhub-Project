import { Controller, Post, Body, Query, Get,Param, Res, HttpStatus,Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Response } from 'express';
import { InterestedMember } from 'src/interested-members/schema/interested-members.schema';


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto, @Query('adminId') adminId: string) {
    // Tu peux maintenant utiliser createEventDto qui est déjà validé
    return this.eventService.create(createEventDto);
  }

  // Nouveau endpoint pour récupérer les événements
  @Get()
  async getAllEvents() {
    return this.eventService.findAll();
  }


  @Delete(':eventId')
async deleteEvent(@Param('eventId') eventId: string, @Res() res: Response) {
  console.log('Attempting to delete event with ID:', eventId); // Ajout de log
  try {
    // Suppression de l'événement dans le service
    const deletedEvent = await this.eventService.deleteEvent(eventId);

    if (!deletedEvent) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Event not found' });
    }

    // Retourner la date de l'événement supprimé pour que le frontend puisse agir
    return res.status(HttpStatus.OK).json({
      message: 'Event deleted successfully',
      date: deletedEvent.date, // Assure-toi que la date est présente dans le modèle supprimé
    });
  } catch (error) {
    console.error('Error deleting event:', error.message); // Log de l'erreur
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }

}



  // GET /events (pour les membres)
@Get()
async findAllForMembers(@Query('clubId') clubId: string) {
  return await this.eventService.findAll(clubId); // Méthode dans votre service pour récupérer les événements
}

// Endpoint to get all interested members for a specific event
@Get(':eventId/interested-members')
async getInterestedMembersByEvent(@Param('eventId') eventId: string): Promise<InterestedMember[]> {
    return this.eventService.getInterestedMembersByEvent(eventId);
}

}