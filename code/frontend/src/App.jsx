import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'; 
import Login from './pages/Login';
import ClassSearch from './pages/ClassSearch';
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path="/login" element={< Login/>}/>
        <Route path="/classSearch" element={< ClassSearch/>}/>
      </Routes>
    </Router>
  )

}
export default App;
