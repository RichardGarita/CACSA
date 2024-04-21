import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AddProducer from './components/addProducer';
import ViewProducer from './components/viewProducer';
import Login from './components/login';
import Index from './components/index';
import Header from './components/header';
import ViewUsers from './components/users';
import NotFound from './components/notFound';
import { AuthContext } from './utils/authContext';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  const {loading, token} = useContext(AuthContext);

  if(loading)
    return <h1>Cargando mi negro</h1>

  return (
    <div className="App">
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
              <Route path='/producer/:id' element={<ViewProducer/>}/>
              <Route path='/newProducer' element={<AddProducer/>}/>
            </Routes>
          </>
        }
    </div>
  );
}

export default App;
