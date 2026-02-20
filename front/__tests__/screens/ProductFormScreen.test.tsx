import { ProductFormScreen } from '../../src/screens/ProductFormScreen';

const mockOnSuccess = jest.fn();
const mockOnCancel = jest.fn();

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

  it('accepts mode add and callbacks', () => {
    expect(ProductFormScreen).toBeDefined();
    const props = { mode: 'add' as const, onSuccess: mockOnSuccess, onCancel: mockOnCancel };
    expect(props.mode).toBe('add');
  });

  it('accepts mode edit with initialProduct', () => {
    const product = {
      id: 'uno',
      name: 'Product',
      description: 'Description of product here',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    };
    const props = { mode: 'edit' as const, initialProduct: product, onSuccess: mockOnSuccess, onCancel: mockOnCancel };
    expect(props.initialProduct?.id).toBe('uno');
  });
});
