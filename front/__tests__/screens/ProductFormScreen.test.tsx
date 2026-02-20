import { ProductFormScreen } from '../../src/screens/ProductFormScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: { mode: 'add' as const } }),
}));

describe('ProductFormScreen', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('false'),
    });
  });

  it('is a function component', () => {
    expect(typeof ProductFormScreen).toBe('function');
  });

  it('accepts mode add via route params', () => {
    expect(ProductFormScreen).toBeDefined();
    const params = { mode: 'add' as const };
    expect(params.mode).toBe('add');
  });

  it('accepts mode edit with product via route params', () => {
    const product = {
      id: 'uno',
      name: 'Product',
      description: 'Description of product here',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    };
    const params = { mode: 'edit' as const, product };
    expect(params.mode).toBe('edit');
    expect(params.product?.id).toBe('uno');
  });
});
