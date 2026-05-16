import request from 'supertest';
import app from '../src/app.js';
import { jest } from '@jest/globals';

import Event from '../src/models/Event.js';

jest.setTimeout(15000);

describe('Auth API', () => {
    it('should return API running message', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);

        expect(res.body.message).toBe(
            'Virtual Event Management API Running'
        );
    });
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email:
                    'testuser123@gmail.com',
                password: '123456',
                role: 'attendee',
            });

        expect(res.statusCode).toBe(201);

        expect(res.body.success).toBe(true);
    });
    it('should not register duplicate email', async () => {
        const userData = {
            name: 'Duplicate User',
            email: 'duplicate@test.com',
            password: '123456',
            role: 'attendee',
        };

        await request(app)
            .post('/api/auth/register')
            .send(userData);

        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(res.statusCode).toBe(409);

        expect(res.body.success).toBe(false);
    });
    it('should login successfully', async () => {
        const userData = {
            name: 'Login User',
            email: 'login@test.com',
            password: '123456',
            role: 'attendee',
        };

        await request(app)
            .post('/api/auth/register')
            .send(userData);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password,
            });

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.token).toBeDefined();
    });
    it('should fail login with invalid password', async () => {
        const userData = {
            name: 'Wrong Password User',
            email: 'wrongpassword@test.com',
            password: '123456',
            role: 'attendee',
        };

        await request(app)
            .post('/api/auth/register')
            .send(userData);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);
    });
    it('should fail when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'missing@test.com',
            });

        expect(res.statusCode).toBe(400);
    });
});
describe('Event API', () => {
    let organizerToken;
    let attendeeToken;
    let createdEventId;

    beforeEach(async () => {
        const organizerData = {
            name: 'Organizer User',
            email: 'organizer@test.com',
            password: '123456',
            role: 'organizer',
        };

        const attendeeData = {
            name: 'Attendee User',
            email: 'attendee@test.com',
            password: '123456',
            role: 'attendee',
        };

        await request(app)
            .post('/api/auth/register')
            .send(organizerData);

        await request(app)
            .post('/api/auth/register')
            .send(attendeeData);

        const organizerLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: organizerData.email,
                password: organizerData.password,
            });

        const attendeeLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: attendeeData.email,
                password: attendeeData.password,
            });

        organizerToken =
            organizerLogin.body.token;

        attendeeToken =
            attendeeLogin.body.token;
    });

    it('should allow organizer to create event', async () => {
        const res = await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'React Conference',
                description:
                    'Advanced React Event',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        expect(res.statusCode).toBe(201);

        expect(res.body.success).toBe(true);

        createdEventId = res.body.event._id;
    });

    it('should prevent attendee from creating event', async () => {
        const res = await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${attendeeToken}`
            )
            .send({
                title: 'Unauthorized Event',
                description:
                    'Unauthorized Creation',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        expect(res.statusCode).toBe(403);
    });

    it('should fetch all events', async () => {
        await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'Test Event',
                description: 'Test Description',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        const res = await request(app).get(
            '/api/events'
        );

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.events.length).toBeGreaterThan(
            0
        );
    });

    it('should allow organizer to update own event', async () => {
        const createdEvent = await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'Original Event',
                description: 'Original',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        const eventId =
            createdEvent.body.event._id;

        const res = await request(app)
            .put(`/api/events/${eventId}`)
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'Updated Event',
            });

        expect(res.statusCode).toBe(200);

        expect(
            res.body.event.title
        ).toBe('Updated Event');
    });

    it('should allow organizer to delete own event', async () => {
        const createdEvent = await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'Delete Event',
                description: 'Delete',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        const eventId =
            createdEvent.body.event._id;

        const res = await request(app)
            .delete(`/api/events/${eventId}`)
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            );

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);
    });
});
describe('Registration API', () => {
    let organizerToken;
    let attendeeToken;
    let eventId;

    beforeEach(async () => {
        const organizerData = {
            name: 'Event Organizer',
            email: 'eventorganizer@test.com',
            password: '123456',
            role: 'organizer',
        };

        const attendeeData = {
            name: 'Event Attendee',
            email: 'eventattendee@test.com',
            password: '123456',
            role: 'attendee',
        };

        await request(app)
            .post('/api/auth/register')
            .send(organizerData);

        await request(app)
            .post('/api/auth/register')
            .send(attendeeData);

        const organizerLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: organizerData.email,
                password: organizerData.password,
            });

        const attendeeLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: attendeeData.email,
                password: attendeeData.password,
            });

        organizerToken =
            organizerLogin.body.token;

        attendeeToken =
            attendeeLogin.body.token;

        const createdEvent = await request(app)
            .post('/api/events')
            .set(
                'Authorization',
                `Bearer ${organizerToken}`
            )
            .send({
                title: 'Registration Event',
                description:
                    'Registration Test',
                date: '2026-12-10',
                time: '10:00 AM',
                location: 'Online',
            });

        eventId =
            createdEvent.body.event._id;
    });

    it('should allow attendee to register for event', async () => {
        const res = await request(app)
            .post(
                `/api/events/${eventId}/register`
            )
            .set(
                'Authorization',
                `Bearer ${attendeeToken}`
            );

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);
    });

    it('should prevent duplicate event registration', async () => {
        await request(app)
            .post(
                `/api/events/${eventId}/register`
            )
            .set(
                'Authorization',
                `Bearer ${attendeeToken}`
            );

        const res = await request(app)
            .post(
                `/api/events/${eventId}/register`
            )
            .set(
                'Authorization',
                `Bearer ${attendeeToken}`
            );

        expect(res.statusCode).toBe(409);
    });
});