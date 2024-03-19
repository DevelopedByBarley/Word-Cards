import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/user/Login';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Dashboard from './pages/user/Dashboard';


function App() {

  return (
    <>
      <Navigation />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="user">
            <Route path="" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
      </>
  );
}

export default App;
