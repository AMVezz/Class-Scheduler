import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '/src/pages/Home'; 
import Login from '/src/pages/Login';
import ClassSearch from '/src/pages/ClassSearch';
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
