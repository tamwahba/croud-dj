import App from './app';
import HomePage from './pages/home';

export default {
  path: '/',
  component: App,
  childRoutes: [
    {
      path: '/',
      component: HomePage,
    },
  ],
};
