import { render } from 'react-dom';
import MainWindow from './mainWindow/App';
import QuickWindow from './quickWindow/App';
import { StoreProvider } from './contextProvider/storeContext';

const name = window.location.search.substr(1);
let View;
if (name === 'MainWindow') {
  View = <MainWindow />;
} else {
  View = <QuickWindow />;
}

render(<StoreProvider>{View}</StoreProvider>, document.getElementById('root'));
