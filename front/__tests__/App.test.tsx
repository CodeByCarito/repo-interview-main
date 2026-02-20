import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { it } from '@jest/globals';

jest.mock('../src/screens/ProductListScreen', () => ({ ProductListScreen: () => null }));
jest.mock('../src/screens/ProductDetailScreen', () => ({ ProductDetailScreen: () => null }));
jest.mock('../src/screens/ProductFormScreen', () => ({ ProductFormScreen: () => null }));

import App from '../App';

it('renders correctly', () => {
  const tree = renderer.create(<App />);
  expect(tree.toJSON()).toBeTruthy();
});
