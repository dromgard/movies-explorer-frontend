import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import NotFound from '../NotFound/NotFound';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import SavedMovies from '../SavedMovies/SavedMovies';

function App() {

  // States.
  const [isMainPage, setIsMainPage] = useState(false);

  // Используем хук useLocation для отрисовки компонентов.
  const { pathname } = useLocation();
  const urlHeaderRender = ['/', '/movies', '/saved-movies', '/profile'];
  const urlFooterRender = ['/', '/movies', '/saved-movies'];

  // Проверка на главную страницу и изменение стейта.
  function CheckMainPage() {
    pathname === '/' ? setIsMainPage(true) : setIsMainPage(false)
  }

  // Отслеживаем изменение роута и запускаем проверку на главную страницу.
  useEffect(() => {
    CheckMainPage();
  }, [pathname]);

  // Сравнивает текущий роут с переданным массивом роутов.
  function compareUrl(urlList) {
    for (let key in urlList) {
      if (urlList[key] === pathname) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="app">
      {compareUrl(urlHeaderRender) ? <Header isMainPage={isMainPage} /> : null}

      <Routes>
        <Route exact path='/' element={<Main />}>
        </Route>
        <Route path='/movies' element={<Movies />}>
        </Route>
        <Route path='/saved-movies' element={<SavedMovies />}>
        </Route>
        <Route path='/profile' element={<Profile />}>
        </Route>
        <Route path='/signup' element={<Register />}>
        </Route>
        <Route path='/signin' element={<Login />}>
        </Route>
        <Route path="*" element={<NotFound />}>
        </Route>
      </Routes>

      {compareUrl(urlFooterRender) ? <Footer /> : null}

    </div>
  );
}

export default App;
