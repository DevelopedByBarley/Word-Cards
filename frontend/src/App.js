import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/user/Login';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Dashboard from './pages/user/Dashboard';
import { createContext, useLayoutEffect, useState } from 'react';
import { fetchAuthentication } from './services/AuthService';
import Loader from './components/Loader';
import Theme from './pages/user/Theme';
import StoreCard from './pages/user/StoreCard';
import CompareCard from './pages/user/CompareCard';
import AlertComponent from './components/AlertComponent';


export const UserContext = createContext();
export const AlertContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [alert, setAlert] = useState({
    show: false,
    variant: '',
    message: ''
  });

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setPending(false);
      return;
    }

    fetchAuthentication.get('/user')
      .then(res => setUser(res.data.user))
      .catch(err => console.error(err))
      .finally(() => setPending(false));
  }, []);

  return (
    <>
      {pending ? <Loader /> : (
        <AlertContext.Provider value={{ alert, setAlert }}>
          <UserContext.Provider value={{ user, setUser }}>
            {alert.show && <AlertComponent alert={alert} setAlert={setAlert} message={alert.message} variant={alert.variant} />}
            <Navigation />
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="user">
                  <Route path="" element={<Login />} />
                  <Route path="dashboard" element={<Dashboard user={user} />} />
                  <Route path="theme/:id" element={<Theme user={user} />} />
                  <Route path="theme/:themeId/cards/new" element={<StoreCard />} />
                  <Route path="cards" element={<CompareCard />} />
                </Route>
              </Routes>
            </Router>
          </UserContext.Provider>
        </AlertContext.Provider>
      )}
    </>
  );
}
