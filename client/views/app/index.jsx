import PropTypes from 'prop-types';
import React from 'react';

function App({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}

App.propTypes = {
  children: PropTypes.element,
};

export default App;
