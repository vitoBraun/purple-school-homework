import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users end to end', () => {
	it('Register success', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@example.com', password: 'example', name: 'Vasya' });
		expect(res.statusCode).toBe(422);
	});
	it('Login success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@example.com', password: 'example' });
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Login error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@exampsad', password: 'example2' });
		expect(res.statusCode).toBe(401);
	});
	it('Get info being authenticated', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@example.com', password: 'example' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('test@example2.com');
	});
	it('Get info - no authorization', async () => {
		const res = await request(application.app).get('/users/info');
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
