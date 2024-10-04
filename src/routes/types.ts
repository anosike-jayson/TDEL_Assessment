import { IncomingMessage } from 'http';
export interface CustomRequest extends IncomingMessage {
    params?: Record<string, any>; 
    body?: Record<string, any>; 
}