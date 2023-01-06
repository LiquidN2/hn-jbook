import 'bulmaswatch/darkly/bulmaswatch.min.css';
import { createRoot } from 'react-dom/client';

import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';

const root = createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
