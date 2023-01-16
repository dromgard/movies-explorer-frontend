import { useState, useMemo, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import NotFound from '../NotFound/NotFound';
import PopupMenu from '../PopupMenu/PopupMenu';
import Profile from '../Profile/Profile';
import Register from '../Register/Register';
import SavedMovies from '../SavedMovies/SavedMovies';
import { mainApi } from '../../utils/MainApi';
import { moviesApi } from '../../utils/MoviesApi';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

function App() {

  // States для вёрстки.
  const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false);

  // States для пользователя.
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // Используем хук useLocation для отрисовки компонентов.
  const { pathname } = useLocation();
  const urlHeaderRender = ['/', '/movies', '/saved-movies', '/profile'];
  const urlFooterRender = ['/', '/movies', '/saved-movies'];

  //Отслеживаем изменение роута и запускаем проверку на главную страницу.
  const isMainPage = useMemo(() => pathname === '/' ? true : false, [pathname]);

  let navigate = useNavigate();

  // Проверяем наличие токена в локальном хранилище, загружаем данные пользователя и карточки.
  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    mainApi.setToken(jwt);
    if (jwt) {
      mainApi.getUserInfo()
        .then((userData) => {
          if (userData) {
            console.log('tokenCheck', userData);
            setCurrentUser(userData);
            setLoggedIn(true);
            navigate("/movies");
          } else {
            setLoggedIn(false);
            navigate("/");
          }
        })
        .catch((err) => {
          setLoggedIn(false);
          console.log(`Переданный токен некорректен: ${err}`);
        });
    } else {
      setLoggedIn(false);
      navigate("/");
    }
  };

  // Проверка на логин при загрузке страницы.
  useEffect(() => {
    tokenCheck();
  }, [loggedIn]);

  // Обработчик логина.
  const handleLogin = (userEmail, userPassword, resetLoginForm) => {
    if (!userEmail || !userPassword) {
      return;
    }
    mainApi
      .authorize(userEmail, userPassword)
      .then((data) => {
        console.log('handleLogin', data);
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          navigate("/movies");
          resetLoginForm();
        }
      })
      .catch((err) => {
        // setResultMessage({
        //   text: "Что-то пошло не так! Попробуйте ещё раз.",
        //   image: authError,
        // });
        // setIsInfoMessagePopupOpen(true);
        console.log(err);
      });
  };

  // Обработчик регистрации.
  const handleRegister = (userEmail, userPassword, userName, resetRegisterForm) => {
    mainApi
      .register(userEmail, userPassword, userName)
      .then((res) => {
        console.log('handleRegister', res);
        // setResultMessage({
        //   text: "Вы успешно зарегистрировались!",
        //   image: regSuccess,
        // });
        navigate("/signin");
        resetRegisterForm();
        console.log("Успех регистрации", res);
      })
      .catch((err) => {
        // setResultMessage({
        //   text: "Что-то пошло не так!",
        //   image: authError,
        // });
        console.log("Ошибка регистрации", err);
      });
    // .finally(() => {
    //   setIsInfoMessagePopupOpen(true);
    // });
  };

  // Обрабатываем выход из аккаунта.
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("request");
    localStorage.removeItem("moviesCards");
    localStorage.removeItem("filtercheckbox");
    navigate("/signin");
    setLoggedIn(false);
  };

  // Обработчик сохранения данных пользователя.
  function handleUpdateUser(name, email) {
    mainApi
      .editUserInfo(name, email)
      .then((userData) => {
        setCurrentUser(userData.data);
      })
      .catch((err) => {
        console.log(`Ошибка обновления данных пользователя: ${err}`);
      });
  }

  // Обработчик получения фильмов.
  function handleGetMovies(request, filtercheckbox) {
    moviesApi
      .getMoviesCards()
      .then((moviesCards) => {
        console.log(moviesCards);
        localStorage.setItem("request", request);
        localStorage.setItem("moviesCards", moviesCards);
        localStorage.setItem("filtercheckbox", filtercheckbox);
      })
      .catch((err) => {
        console.log(`Ошибка загрзуки фильмов: ${err}`);
      });
  }

  // Сравнивает текущий роут с переданным массивом роутов.
  function compareUrl(urlList) {
    for (let key in urlList) {
      if (urlList[key] === pathname) {
        return true;
      }
    }
    return false;
  }

  // Открываем и закрываем попап с меню.
  const togglePopupMenu = () => {
    setIsPopupMenuOpen(!isPopupMenuOpen);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        {compareUrl(urlHeaderRender) ? <Header loggedIn={loggedIn} isMainPage={isMainPage} togglePopupMenu={togglePopupMenu} /> : null}

        <Routes>
          <Route exact path='/' element={<Main />}>
          </Route>
          <Route path='/movies' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Movies handleGetMovies={handleGetMovies} />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/saved-movies' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <SavedMovies />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/profile' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Profile onEditProfile={handleUpdateUser} handleLogout={handleLogout} />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/signup' element={<Register handleRegister={handleRegister} />}>
          </Route>
          <Route path='/signin' element={<Login handleLogin={handleLogin} />}>
          </Route>
          <Route path="*" element={<NotFound />}>
          </Route>
        </Routes>

        {compareUrl(urlFooterRender) ? <Footer /> : null}

        <PopupMenu isOpen={isPopupMenuOpen} togglePopupMenu={togglePopupMenu} compareUrl={compareUrl} />

      </div >
    </CurrentUserContext.Provider >
  );
}

export default App;
