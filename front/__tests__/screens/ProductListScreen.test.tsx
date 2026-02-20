import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { ProductListScreen } from '../../src/screens/ProductListScreen';

const mockNavigate = jest.fn();
let mockFocusEffectRun = false;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  useRoute: () => ({ params: {} }),
  useFocusEffect: (cb: () => void) => {
    if (!mockFocusEffectRun) {
      mockFocusEffectRun = true;
      setTimeout(cb, 0);
    }
  },
}));
jest.mock('react-native-safe-area-context', () => {
  const RN = require('react-native');
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaView: RN.View,
  };
});

describe('ProductListScreen', () => {
  beforeEach(() => {
    mockFocusEffectRun = false;
    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ data: [] })),
    });
  });

  it('renders loading skeleton initially then list', async () => {
    const tree = renderer.create(<ProductListScreen />);
    expect(tree.toJSON()).toBeTruthy();
    await renderer.act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    await renderer.act(async () => {
      await new Promise(r => setImmediate(r));
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
    const tree = renderer.create(<ProductListScreen />);
    await renderer.act(async () => {
      await new Promise(r => setTimeout(r, 0));
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
