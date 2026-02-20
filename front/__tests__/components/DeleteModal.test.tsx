import React from 'react';
import renderer from 'react-test-renderer';
import { DeleteModal } from '../../src/components/DeleteModal';

describe('DeleteModal', () => {
  it('renders when visible with product name', () => {
    const tree = renderer.create(
      <DeleteModal
        visible
        productName="Tarjeta Crédito"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders nothing when not visible', () => {
    const tree = renderer.create(
      <DeleteModal
        visible={false}
        productName="Product"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    ).toJSON();
    expect(tree).toBeFalsy();
  });
});
