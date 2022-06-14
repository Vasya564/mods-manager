import './styles/common.scss'
import { Routes, Route, HashRouter } from 'react-router-dom'
import HomePage from './pages/HomePage';
import CustomPage from './pages/CustomPage';
import UsualPage from './pages/UsualPage';
import SettingsPage from './pages/SettingsPage';
function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />}></Route>
          <Route path='/versions/custom' element={<CustomPage />}></Route>
          <Route path='/versions/usual' element={<UsualPage />}></Route>
          <Route path='/settings' element={<SettingsPage />}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
