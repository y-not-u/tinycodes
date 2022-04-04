import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import List from './List';
import Content from './Content';
import Toolbar from './Toolbar';
import Setting from './Setting';
import { useStore } from '../contextProvider/storeContext';

import './App.css';
import '../../../assets/scss/main.scss';

const App = () => {
  const store = useStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    if (store?.appStore.theme === undefined) {
      return;
    }
    (async () => {
      if (store.appStore.theme === 'system') {
        const isDarkMode = await window.electron.system.isDarkMode();
        setTheme(isDarkMode ? 'dark' : 'light');
      } else {
        setTheme(store.appStore.theme);
      }
    })();
  }, [store?.appStore.theme]);

  return (
    <div data-theme={theme}>
      <Router initialEntries={['/all', '/star']} initialIndex={0}>
        <div className="home">
          <Sidebar />
          <div className="right-side">
            <Toolbar />
            <div className="main-area">
              <Switch>
                <Route path="/all">
                  <List />
                  <Content />
                </Route>
                <Route path="/star">
                  <List filter="star" />
                  <Content />
                </Route>
                <Route path="/setting">
                  <Setting />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default observer(App);
