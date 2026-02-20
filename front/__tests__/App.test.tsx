import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { it } from '@jest/globals';

jest.mock('@react-navigation/stack', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }: any) => {
        const first = R.Children.toArray(children)[0];
        return first ?? R.createElement(RN.View);
      },
      Screen: ({ component: Component }: any) =>
        R.createElement(RN.View, null, Component ? R.createElement(Component) : null),
    }),
  };
});
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));
jest.mock('../src/screens/ProductListScreen', () => ({ ProductListScreen: () => null }));
jest.mock('../src/screens/ProductDetailScreen', () => ({ ProductDetailScreen: () => null }));
jest.mock('../src/screens/ProductFormScreen', () => ({ ProductFormScreen: () => null }));

import App from '../App';

it('renders correctly', () => {
  const tree = renderer.create(<App />);
  expect(tree.toJSON()).toBeTruthy();
});
