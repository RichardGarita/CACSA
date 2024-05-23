import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/header';
import AddProducer from './pages/addProducer';
import ViewProducer from './pages/viewProducer';
import Login from './pages/login';
import Index from './pages/index';
import ViewUsers from './pages/users';
import ViewLogs from './pages/logs';
import NotFound from './pages/notFound';
import { AuthContext } from './utils/authContext';
import 'bootstrap/dist/css/bootstrap.css'
import './styles/App.css';

function App() {
  const {loading, token} = useContext(AuthContext);

  if(loading)
    return <h1>Cargando...</h1>

  return (
    <div className="App">
      <ToastContainer/>
        {!token ? (
          <>
            <Routes>
              <Route path='/' element={<Login/>}/>
              <Route path='*' element={<Navigate to={'/'}/>}/>
            </Routes>
          </>
        ):
          <>
            <Header/>
            <Routes>
              <Route path='*' element={<NotFound/>}/>
              <Route path='/' element={<Index/>}/>
              <Route path='/users' element={<ViewUsers/>}/>
              <Route path='/logs' element={<ViewLogs/>}/>
              <Route path='/producer/:id' element={<ViewProducer/>}/>
              <Route path='/newProducer' element={<AddProducer/>}/>
            </Routes>
          </>
        }
    </div>
  );
}

export default App;
