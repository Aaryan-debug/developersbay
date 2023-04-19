import './App.css';
import Pages from './components/Pages/Pages';
import { BrowserRouter } from 'react-router-dom';
import AppContext from './components/AppContext/AppContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContext>
          <Pages />
        </AppContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
