import { Route, Routes } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route exact path='/' element={<Main />}>
        </Route>
        <Route path='/movies' element={<Movies />}>
        </Route>
      </Routes>


      <Footer />
    </div>
  );
}

export default App;
