import './styles/common.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import CustomPage from './pages/CustomPage';
import UsualPage from './pages/UsualPage';
import SettingsPage from './pages/SettingsPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />}></Route>
          <Route path='/versions/custom' element={<CustomPage />}></Route>
          <Route path='/versions/usual' element={<UsualPage />}></Route>
          <Route path='/settings' element={<SettingsPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
