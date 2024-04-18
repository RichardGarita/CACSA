import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AddProducer from './components/addProducer/agregarProductor';
import ViewProducer from './components/viewProducer/viewProducer';
import Login from './components/login';
import Index from './components/index';
import { AuthContext } from './utils/authContext';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  const {loading, token} = useContext(AuthContext);

  if(loading)
    return <h1>Cargando mi negro</h1>

  return (
    <div className="App">
      <Routes>
        {!token ? (
          <>
            <Route path='/' element={<Login/>}/>
            <Route path='/*' element={<Navigate to={'/'}/>}/>
          </>
        ):
          <>
            <Route path='/' element={<Index/>}/>
            <Route path='/producer/:id' element={<ViewProducer/>}/>
            <Route path='/newProducer' element={<AddProducer/>}/>
          </>
        }
      </Routes>
    </div>
  );
}

export default App;
