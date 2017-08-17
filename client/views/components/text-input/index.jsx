import PropTypes from 'prop-types';
import React from 'react';
import BEMhelper from 'react-bem-helper';

import './styles.less';

const block = new BEMhelper({
  name: 'text-input',
  outputIsString: true,
});

let count = -1;

class TextInput extends React.Component {
  static get key() {
    count += 1;
    return count;
  }

  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      id: TextInput.key,
      isValid: true,
      value: props.value,
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.value !== newProps.value) {
      this.setState({
        value: newProps.value,
      });
    }
  }

  handleBlur(event) {
    event.preventDefault();
    this.props.onBlur();
  }

  handleChange(event) {
    const text = event.target.value;

    this.props.validate(text)
      .then(({ errorText = '', isValid }) => {
        this.setState({ errorText, isValid });
      })
      .catch(() => this.setState({ isValid: false }));

    this.setState({ value: text });
    this.props.onChange(text);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onCommit(this.state.value, this.state.isValid);
  }

  render() {
    const { label, password } = this.props;
    const { errorText, id, isValid, value } = this.state;

    const modifiers = {
      error: !isValid,
      filled: value,
    };

    return (
      <form onSubmit={this.handleSubmit}>
        <span className={block({ modifiers })}>
          <input
            id={`text-input-${id}`}
            className={block('field', modifiers)}
            type={password ? 'password' : 'text'}
            value={value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
          <label
            htmlFor={`text-input-${id}`}
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
  onChange: () => null,
  onCommit: () => null,
  password: false,
  validate: () => Promise.resolve({ isValid: true }),
  value: '',
};

TextInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onCommit: PropTypes.func,
  password: PropTypes.bool,
  validate: PropTypes.func,
};

export default TextInput;
