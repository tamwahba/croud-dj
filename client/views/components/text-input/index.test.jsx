/* eslint-env mocha */
import { shallow } from 'enzyme';
import expect from 'expect';
import enzymify from 'expect-enzyme';
import React from 'react';

import TextInput from './index';

expect.extend(enzymify());

describe('views', () => {
  describe('components', () => {
    describe('text-input', () => {
      const value = 'value';
      const label = 'label';
      const onBlur = expect.createSpy();
      const onChange = expect.createSpy();
      const onCommit = expect.createSpy();
      const password = false;
      const validate = expect.createSpy().andReturn(Promise.resolve());
      let textInput;

      beforeEach(() => {
        onChange.reset();
        onCommit.reset();
        validate.reset();

        textInput = shallow(<TextInput
          value={value}
          label={label}
          onBlur={onBlur}
          onChange={onChange}
          onCommit={onCommit}
          password={password}
          validate={validate}
        />);
      });

      it('should be a form', () => {
        expect(textInput).toBeA('form');
      });

      it('should contain element `span.text-input`', () => {
        expect(textInput).toContain('span.text-input');
      });

      it('should have input id match label htmlFor', () => {
        expect(textInput.find('input')).toHaveProp('id');
        const inputID = textInput.find('input').props().id;

        expect(textInput.find('label')).toHaveProp('htmlFor', inputID);
      });

      it('should have different input id for each instance', () => {
        const otherTextInput = shallow(<TextInput
          value={value}
          label={label}
          onBlur={onBlur}
          onChange={onChange}
          onCommit={onCommit}
          password={password}
          validate={validate}
        />);

        expect(textInput.find('input')).toHaveProp('id');
        expect(otherTextInput.find('input')).toHaveProp('id');


        const id = textInput.find('input').props().id;
        const otherID = otherTextInput.find('input').props().id;

        expect(id).toNotEqual(otherID);
      });

      it('should have input type text when prop password is false', () => {
        textInput.setProps({ password: false });

        expect(textInput).toContain('input[type="text"]');
      });

      it('should have input type password when prop password is true', () => {
        textInput.setProps({ password: true });

        expect(textInput).toContain('input[type="password"]');
      });

      it('should update input value when prop value changes', () => {
        const newValue = 'new-value';

        expect(textInput).toHaveState({ value });
        expect(textInput.find('input')).toHaveProp('value', value);

        textInput.setProps({ value: newValue });

        expect(textInput).toHaveState({ value: newValue });
        expect(textInput.find('input')).toHaveProp('value', newValue);
      });

      it('should call prop onBlur when input is unfocused', () => {
        const preventDefault = expect.createSpy();
        textInput.find('input').simulate('blur', {
          preventDefault,
        });

        expect(preventDefault).toHaveBeenCalled();
        expect(onBlur).toHaveBeenCalled();
      });

      it('should call prop onChange when input change triggers', () => {
        const newValue = 'new';
        textInput.find('input').simulate('change', {
          target: {
            value: newValue,
          },
        });

        expect(onChange).toHaveBeenCalledWith(newValue);
      });

      it('should call prop onCommit when submitted', () => {
        const preventDefault = expect.createSpy();
        textInput.simulate('submit', {
          preventDefault,
        });

        expect(preventDefault).toHaveBeenCalled();
        expect(onCommit).toHaveBeenCalled();
      });

      it('should show error when prop validate resolves with error', () => {
        const errorText = 'error';
        const isValid = false;
        const validateFail = expect.createSpy().andReturn(Promise.resolve({ errorText, isValid }));

        textInput.setProps({
          validate: validateFail,
        });
        textInput.find('input').simulate('change', {
          target: {
            value: 'text',
          },
        });

        expect(validateFail).toHaveBeenCalled();
        return validateFail().then(() => {
          expect(textInput).toHaveState({
            errorText,
            isValid,
          });
          expect(textInput).toContain('.text-input__tip');
        });
      });
    });
  });
});
