import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import jwt from 'jsonwebtoken';
import { IRefreshToken } from '../auth/models/RefreshToken';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }


      verifyJwt(token: string): any {
        try {
          return jwt.verify(token, "ui");
        } catch (err) {
          return null;
        }
      }

    getEvents = async (req: Request, res: Response): Promise<void> => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          res.status(401).send({ error: 'Authorization header is missing' });
          return;
        }
    
        const token = authHeader.split(' ')[1];
        const payload = this.verifyJwt(token);

        if (!payload) {
           res.status(401).json({ message: 'Invalid or expired token' });
           return 
        }

        const secretKey = 'ui'; // Replace with your actual secret key
    
        if (!payload.location) {
          res.status(400).send({ error: 'Location not found in token' });
          return;
        }
    
        const events = await this.eventService.getEvents(payload.location);
        res.status(200).json(events);
      } catch (error: any) {
        res.status(500).send({ error: error.message });
      }
      }

    


    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;