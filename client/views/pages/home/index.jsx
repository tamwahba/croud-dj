import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../../components/icon';

import logo from '../../icons/logo-text.svg';

import screenshot from './croud-dj-screenshot.png';

import './styles.less';

function HomePage() {
  return (
    <div className="home">
      <Icon alt="croud.dj logo" className="home__logo" data={logo} />
      <div className="home__hero-container">
        <img alt="screenshot of croud.dj room page" src={screenshot} />
      </div>
      <section className="home__panel home__panel--top">
        <Link to="/host" className="home__link">Host a new room</Link>
        <span>to allow your friends to queue songs, and vote on which gets played next.</span>
      </section>
      <span className="home__divider">or</span>
      <section className="home__panel home__panel--bottom">
        <Link to="/guest" className="home__link">Join an existing one</Link>
        <span>as a guest to add, and vote on what&#8217;s playing.</span>
      </section>
    </div>
  );
}

export default HomePage;
