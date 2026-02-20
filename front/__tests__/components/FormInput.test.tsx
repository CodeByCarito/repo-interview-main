import React from 'react';
import renderer from 'react-test-renderer';
import { FormInput } from '../../src/components/FormInput';

describe('FormInput', () => {
  it('renders label and input', () => {
    const tree = renderer.create(
      <FormInput label="Nombre" value="" onChangeText={jest.fn()} />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders error message when error prop is set', () => {
    const tree = renderer.create(
      <FormInput
        label="ID"
        value=""
        onChangeText={jest.fn()}
        error="ID no válido"
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders with disabled state', () => {
    const tree = renderer.create(
      <FormInput label="ID" value="x" onChangeText={jest.fn()} disabled />
    ).toJSON();
    expect(tree).toBeTruthy();
  });
});
