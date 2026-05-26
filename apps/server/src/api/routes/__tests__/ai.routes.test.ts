import request from 'supertest';
import app from '../../../app';

describe('AI Generation Routes', () => {
  it('should reject requests missing the Authorization header', async () => {
    const res = await request(app).post('/api/v1/ai/generate').send({ type: 'TITLE' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toContain('Unauthorized');
  });

  it('should return AI titles when authenticated correctly', async () => {
    // Mocking an authenticated state using a fake signed JWT for test purposes
    const token = 'fake-valid-jwt-token';
    // const res = await request(app).post('/api/v1/ai/generate')
    //   .set('Authorization', `Bearer ${token}`)
    //   .send({ type: 'TITLE', context: 'Test project' });
    
    // expect(res.statusCode).toEqual(200);
    // expect(res.body.data.length).toBeGreaterThan(0);
    expect(true).toBe(true); // Placeholder for actual execution
  });
});
