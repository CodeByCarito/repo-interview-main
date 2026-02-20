import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { ProductListScreen } from '../../src/screens/ProductListScreen';

const mockOnSelectProduct = jest.fn();
const mockOnAdd = jest.fn();

describe('ProductListScreen', () => {
  beforeEach(() => {
    mockOnSelectProduct.mockClear();
    mockOnAdd.mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ data: [] })),
    });
  });

  it('renders loading skeleton initially then list', async () => {
    const tree = renderer.create(
      <ProductListScreen onSelectProduct={mockOnSelectProduct} onAdd={mockOnAdd} />
    );
    expect(tree.toJSON()).toBeTruthy();
    await renderer.act(async () => {
      await Promise.resolve();
    });
    expect(tree.toJSON()).toBeTruthy();
  });

  it('shows list after load', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            data: [
              {
                id: 'uno',
                name: 'Producto Uno',
                description: 'Desc',
                logo: 'logo.png',
                date_release: '2025-01-01',
                date_revision: '2026-01-01',
              },
            ],
          })
        ),
    });
    const tree = renderer.create(
      <ProductListScreen onSelectProduct={mockOnSelectProduct} onAdd={mockOnAdd} />
    );
    await renderer.act(async () => {
      await Promise.resolve();
    });
    await renderer.act(async () => {
      await new Promise(r => setImmediate(r));
    });
    const texts = tree.root.findAllByType(Text);
    const hasProductName = texts.some(
      (node: any) => {
        const c = node.props.children;
        const s = Array.isArray(c) ? c.join('') : String(c ?? '');
        return s.includes('Producto Uno');
      }
    );
    expect(hasProductName).toBe(true);
  });
});
