import { productsApi } from '../../src/api/products';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('productsApi', () => {
  it('getAll returns data array', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            data: [
              {
                id: 'uno',
                name: 'Product',
                description: 'Desc',
                logo: 'logo.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01',
              },
            ],
          })
        ),
    });
    const result = await productsApi.getAll();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('uno');
    expect(result[0].name).toBe('Product');
  });

  it('verifyIdExists returns boolean', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('true'),
    });
    const result = await productsApi.verifyIdExists('uno');
    expect(result).toBe(true);
  });

  it('create sends POST with body', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            message: 'Product added successfully',
            data: {
              id: 'dos',
              name: 'Nombre',
              description: 'Descripción producto',
              logo: 'assets-1.png',
              date_release: '2025-01-01',
              date_revision: '2026-01-01',
            },
          })
        ),
    });
    const payload = {
      id: 'dos',
      name: 'Nombre',
      description: 'Descripción producto',
      logo: 'assets-1.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    };
    const result = await productsApi.create(payload);
    expect(result.id).toBe('dos');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/bp/products'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('update sends PUT with id in path', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            message: 'Product updated successfully',
            data: {
              id: 'uno',
              name: 'Updated',
              description: 'Desc',
              logo: 'logo.png',
              date_release: '2025-01-01',
              date_revision: '2026-01-01',
            },
          })
        ),
    });
    const payload = {
      name: 'Updated',
      description: 'Desc',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    };
    await productsApi.update('uno', payload);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/bp/products/uno'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    );
  });

  it('delete sends DELETE', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ message: 'Product removed successfully' })),
    });
    await productsApi.delete('dos');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/bp/products/dos'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
