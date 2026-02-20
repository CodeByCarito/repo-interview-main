import { apiRequest, ApiError } from '../../src/api/client';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe('ApiError', () => {
  it('has name, message, status, body', () => {
    const err = new ApiError('Bad request', 400, { message: 'Invalid' });
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('Bad request');
    expect(err.status).toBe(400);
    expect(err.body).toEqual({ message: 'Invalid' });
  });
});

describe('apiRequest', () => {
  it('returns parsed JSON on 200', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ data: [1, 2, 3] })),
      } as Response)
    );
    const result = await apiRequest<{ data: number[] }>('/test');
    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('throws ApiError on !ok with body message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              name: 'BadRequestError',
              message: 'Invalid body',
            })
          ),
      } as Response)
    );
    await expect(apiRequest('/test')).rejects.toThrow(ApiError);
    try {
      await apiRequest('/test');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).body?.message).toBe('Invalid body');
    }
  });

  it('handles empty response text', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        text: () => Promise.resolve(''),
      } as Response)
    );
    const result = await apiRequest<Record<string, never>>('/test');
    expect(result).toEqual({});
  });
});
