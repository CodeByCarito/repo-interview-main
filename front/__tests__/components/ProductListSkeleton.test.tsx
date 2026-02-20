import React from 'react';
import renderer from 'react-test-renderer';
import { ProductListSkeleton } from '../../src/components/ProductListSkeleton';

describe('ProductListSkeleton', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(<ProductListSkeleton />).toJSON();
    expect(tree).toBeTruthy();
  });
});
