import React from 'react';
import renderer from 'react-test-renderer';
import { ProductDetailScreen } from '../../src/screens/ProductDetailScreen';

const product = {
  id: 'uno',
  name: 'Tarjeta Crédito',
  description: 'Tarjeta de consumo',
  logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
  date_release: '2025-01-01',
  date_revision: '2026-01-01',
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: { product } }),
}));

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ message: 'Product removed successfully' })),
    });
  });

  it('renders product details', () => {
    const tree = renderer.create(<ProductDetailScreen />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('displays product name in content', () => {
    const tree = renderer.create(<ProductDetailScreen />);
    expect(tree.root.findByProps({ children: 'Tarjeta Crédito' })).toBeTruthy();
  });
});
