import PropTypes from 'prop-types';
import React from 'react';
import BEMhelper from 'react-bem-helper';

import './styles.less';

const block = new BEMhelper({
  name: 'text-input',
  outputIsString: true,
});

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      isValid: true,
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBlur(event) {
    event.preventDefault();
    this.props.onBlur();
  }

  handleChange(event) {
    const text = event.target.value;

    this.props.validate(text)
      .then(({ errorText = '', isValid }) => this.setState({ errorText, isValid }))
      .catch(() => this.setState({ isValid: false }));

    this.props.onChange(text);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onCommit(this.props.value, this.state.isValid);
  }

  render() {
    const { label, name, password, value } = this.props;
    const { errorText, isValid } = this.state;

    const modifiers = {
      error: !isValid,
      filled: value,
    };

    return (
      <form onSubmit={this.handleSubmit}>
        <span className={block({ modifiers })}>
          <input
            id={`${name}`}
            className={block('field', modifiers)}
            type={password ? 'password' : 'text'}
            value={value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
          <label
            htmlFor={`${name}`}
            className={block('label', modifiers)}
          >{label}</label>
          {errorText && !isValid && <span className={block('tip', modifiers)}>{errorText}</span>}
        </span>
      </form>
    );
  }
}

TextInput.defaultProps = {
  onBlur: () => null,
  onCommit: () => null,
  password: false,
  validate: () => Promise.resolve({ isValid: true }),
};

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func,
  password: PropTypes.bool,
  validate: PropTypes.func,
};

export default TextInput;
