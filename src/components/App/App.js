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
import searchFilter from '../../utils/searchFilter';

function App() {

  // States для вёрстки.
  const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false);

  // States для пользователя.
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);

  // States для фильмов.
  const [isLoadingMoviesData, setIsLoadingMoviesData] = useState(false); // Идёт загрузка. Прелоадер.

  const [movies, setMovies] = useState([]); // Исходные фильмы из BitFilms.
  const [savedMovies, setSavedMovies] = useState([]); // Исходные фильмы из нашего API.
  const [filteredMovies, setFilteredMovies] = useState([]); // Отфильтрованные фильмы.
  const [filteredSavedMovies, setFilteredSavedMovies] = useState([]); // Отфильтрованные фильмы.


  const [moviesData, setMoviesData] = useState([]); // Результат поиска на странице "Фильмы"
  const [foundSavedMoviesData, setFoundSavedMoviesData] = useState([]); // Массив "Сохраненные Фильмы"
  const [isNoSavedMoviesFound, setIsNoSavedMoviesFound] = useState(false); //Результат поиска на странице "Сохраненные Фильмы"

  const [isNoMoviesFound, setIsNoMoviesFound] = useState(false); // Поиск фильма ничего не нашел "Фильмы".
  const [isSavedMoviesEmpty, setIsSavedMoviesEmpty] = useState(false); // Поиск фильма ничего не нашел "Сохраненные Фильмы".

  const [isMoviesApiError, setIsMoviesApiError] = useState(false); // Ошибки АПИ после поиска "Фильмы".
  const [isFavouritesMoviesApiError, setIsFavouritesMoviesApiError] = useState(false); //Ошибки АПИ после поиска "Сохраненные Фильмы"

  const [isFiltering, setIsFiltering] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  // Используем хук useLocation для отрисовки компонентов.
  const { pathname } = useLocation();
  const urlHeaderRender = ['/', '/movies', '/saved-movies', '/profile'];
  const urlFooterRender = ['/', '/movies', '/saved-movies'];

  //Отслеживаем изменение роута и запускаем проверку на главную страницу.
  const isMainPage = useMemo(() => pathname === '/' ? true : false, [pathname]);

  let navigate = useNavigate();


  const mergeMovies = (bitFilmsMovies, savedMovies) => {
    return bitFilmsMovies.map((movie) => {
      const savedMovie = savedMovies.find((movieSaved) => movieSaved.movieId === movie.id)
      movie.saved = !!savedMovie;
      movie._id = savedMovie ? savedMovie._id : "";
      return movie;
    })
  }


  const filterMovies = (name, isShorts) => {
    console.log("попали в filterMovies", name, isShorts);
    localStorage.setItem('search-name', name);
    localStorage.setItem('search-isShorts', JSON.stringify(isShorts));

    const filter = (films) => {
      const filteredFilms = searchFilter(name, isShorts, films);
      setFilteredMovies(filteredFilms);
    }

    if (movies.length === 0) {
      const localMovies = JSON.parse(localStorage.getItem('movies') || "[]");
      if (localMovies.length === 0) {
        setIsLoadingMoviesData(true);
        const jwt = localStorage.getItem("jwt");
        mainApi.setToken(jwt);

        Promise.all([moviesApi.getMoviesCards(), mainApi.getSavedMovies()])
          .then(([bitFilmsMovies, { data: savedMovies }]) => {
            console.log("bitFilmsMovies", bitFilmsMovies)
            console.log("savedMovies", savedMovies)
            const mergedMovies = mergeMovies(bitFilmsMovies, savedMovies)
            setIsMoviesApiError(false);
            setMovies(mergedMovies);
            filter(mergedMovies)
            // Сохраняем исходный массив фильмов в localStorage.
            localStorage.setItem('movies', JSON.stringify(mergedMovies));
          })
          .catch((err) => {
            console.log(err);
            setIsMoviesApiError(true);
          })
          .finally(() => {
            setIsLoadingMoviesData(false);
          })
      } else {
        setMovies(localMovies);
        filter(localMovies);
      }

    } else {
      filter(movies);
    }
  }

  // Сохраненки
  const filterSavedMovies = (name, isShorts) => {
    console.log("попали в filterMovies", name, isShorts);
    localStorage.setItem('search-name-saved', name);
    localStorage.setItem('search-isShorts-saved', JSON.stringify(isShorts));

    const filter = (films) => {
      const filteredFilms = searchFilter(name, isShorts, films);
      setFilteredSavedMovies(filteredFilms);
    }

    if (savedMovies.length === 0) {
      const localMovies = JSON.parse(localStorage.getItem('saved-movies') || "[]");
      if (localMovies.length === 0) {
        setIsLoadingMoviesData(true);
        const jwt = localStorage.getItem("jwt");
        mainApi.setToken(jwt);
        mainApi.getSavedMovies()
          .then((res) => {
            const cards = res.data.map((card) => {
              card.saved = true;
              return card;
            })

            setIsMoviesApiError(false);
            setSavedMovies(cards);
            filter(cards)
            // Сохраняем исходный массив фильмов в localStorage.
            localStorage.setItem('saved-movies', JSON.stringify(cards));
          })
          .catch((err) => {
            console.log(err);
            setIsMoviesApiError(true);
          })
          .finally(() => {
            setIsLoadingMoviesData(false);
          })
      } else {
        setSavedMovies(localMovies);
        filter(localMovies);
      }

    } else {
      filter(savedMovies);
    }
  }




  // Проверяем наличие токена в локальном хранилище, загружаем данные пользователя и карточки.
  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    mainApi.setToken(jwt);
    if (jwt) {
      mainApi.getUserInfo()
        .then((userData) => {
          if (userData) {
            setCurrentUser(userData.user);
            setLoggedIn(true);
            // navigate("/movies");
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

  // Обработчик логина.
  const handleLogin = (userEmail, userPassword, resetLoginForm, setIsLoginError) => {
    if (!userEmail || !userPassword) {
      return;
    }
    mainApi
      .authorize(userEmail, userPassword)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          navigate("/movies");
          resetLoginForm();
        }
      })
      .catch((err) => {
        setIsLoginError(true)
        console.log(err);
      });
  };

  // Обработчик регистрации.
  const handleRegister = (userEmail, userPassword, userName, resetRegisterForm, setIsRegisterError) => {
    mainApi
      .register(userEmail, userPassword, userName)
      .then((res) => {
        navigate("/signin");
        resetRegisterForm(true);
      })
      .catch((err) => {
        setIsRegisterError()
      });
  };

  // Обрабатываем выход из аккаунта.
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser({});
    setMoviesData([]);
    setFoundSavedMoviesData([]);
    navigate("/signin");
    setLoggedIn(false);
  };


  // Обработчик сохранения данных пользователя.
  function handleUpdateUser(name, email, setTextError, setIsEditDone) {
    mainApi
      .editUserInfo(name, email)
      .then((userData) => {
        setCurrentUser(userData.data);
        setIsEditDone(true);
      })
      .catch((err) => {
        setTextError(`Ошибка обновления данных пользователя: ${err}`)
        console.log(`Ошибка обновления данных пользователя: ${err}`);
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

  // Поиск и фильтрация фильмов на странице "Фильмы".
  const handleSearchMovies = (request, filtercheckbox) => {
    // 1 этап. Выполняем поиск фильмов и сохраняем данные в localStorage.
    setIsLoadingMoviesData(true);
    localStorage.setItem("request", request);
    localStorage.setItem("filtercheckbox", filtercheckbox);

    moviesApi.getMoviesCards()
      .then((res) => {
        setIsMoviesApiError(false);

        // Сохраняем исходный массив фильмов в localStorage.
        localStorage.setItem('movies', JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
        setIsMoviesApiError(true);
      })
      .finally(() => {
        setIsLoadingMoviesData(false);
      })

    // 2 этап. Фильтрация и сохранение массива фильмов в localStorage.
    const localMoviesData = JSON.parse(localStorage.getItem('movies'));
    if (localMoviesData) {
      const filteredMovies = searchFilter(request, filtercheckbox, localMoviesData);

      // Устанавливаем статус результатов фильтра.
      if (filteredMovies.length === 0) {
        setIsNoMoviesFound(true);
      } else {
        setIsNoMoviesFound(false);
      }

      // Сохраняем фильтрованный массив фильмов в localStorage.
      localStorage.setItem('filtered-movies', JSON.stringify(filteredMovies));

      // Сохраняем фильтрованный массив фильмов в state.
      setMoviesData(filteredMovies);
    }
  };

  // Загрузка всех сохраненных фильмов с Api.
  const loadSavedMoviesData = () => {
    mainApi.getSavedMovies()
      .then((res) => {
        setIsFavouritesMoviesApiError(false);

        if (res.data.length === 0) {
          setIsSavedMoviesEmpty(true);
          setFoundSavedMoviesData(res.data);
          return;
        } else {
          setIsSavedMoviesEmpty(false);
          setFoundSavedMoviesData(res.data.reverse());
        }
      })
      .catch((err) => {
        console.log(err);
        setIsFavouritesMoviesApiError(true);
      })

  }

  // Поиск фильмов на странице "Сохраненные фильмы".
  const handleSearchSavedMovies = async (request, filtercheckbox) => {
    localStorage.setItem("fav-request", request);
    localStorage.setItem("fav-filtercheckbox", filtercheckbox);
    setIsLoadingMoviesData(true);
    await mainApi.getSavedMovies()
      .then((res) => {
        setIsFavouritesMoviesApiError(false);
        if (res.data.length === 0) {
          setIsSavedMoviesEmpty(true);
          setFoundSavedMoviesData(res.data);
          return;
        } else {
          const filteredSavedMovies = searchFilter(request, filtercheckbox, res.data);

          if (filteredSavedMovies.length === 0) {
            setIsNoSavedMoviesFound(true);
          } else {
            setIsNoSavedMoviesFound(false);
          }
          setIsFiltering(true);
          setNeedUpdate(false);
          setFoundSavedMoviesData(filteredSavedMovies)
          setIsSavedMoviesEmpty(false);

        }
      })
      .catch((err) => {
        setIsFavouritesMoviesApiError(true);
      })
      .finally(() => {
        setIsLoadingMoviesData(false);
      })



  }

  // Проверка на логин при загрузке страницы.
  useEffect(() => {
    tokenCheck();
  }, [loggedIn]);



  // Управляем лайками в локал localStorage.
  const toggleFavouritesMoviesInLocal = (id) => {
    console.log("2-управляем лайками в локал")
    // Получаем текущий массив сохраненок.
    const filteredMovies = JSON.parse(localStorage.getItem('filtered-movies'));

    // Находим фильм с нужным id и ставим/удаляем лайк.
    filteredMovies.forEach((foundMovie) => {
      if (foundMovie.id === id) {
        console.log("3-нашли фильм в локал")
        // Нашли фильм и проверяем стоит ли лайк
        if (foundMovie.saved) {
          console.log("4-удалили лайк в локал")
          foundMovie.saved = false
        } else {
          console.log("4-поставили лайк в локал")
          foundMovie.saved = true
        }
      }
    })

    // Сохраняем новый массив в localStorage.
    localStorage.setItem('filtered-movies', JSON.stringify(filteredMovies));
    setMoviesData(filteredMovies);
  }


  // Загружаем фильмы с сервера для удаления из избранного.
  const getSavedMoviesForPageMovies = () => {
    return mainApi.getSavedMovies()
      .then((res) => {
        setIsFavouritesMoviesApiError(false);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        setIsFavouritesMoviesApiError(true);
      })
  }


  // Обработчик удаления фильма из избранного со страницы "Фильмы".
  const deleteSavedMovieForPageMovies = async (id) => {

    const savedMovies = await getSavedMoviesForPageMovies();

    let serverId = "";

    savedMovies.forEach((foundMovie) => {
      if (foundMovie.movieId === id) {
        serverId = foundMovie._id
      }
    })

    mainApi.deleteSavedMovie(serverId)
      .then((res) => {

      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        toggleFavouritesMoviesInLocal(id)
      })
  }

  // Обработчик сохранения фильма в избранное со страницы "Фильмы".
  const handleSaveFavoriteMovie = (card) => {

    console.log("card", card)
    const promise = card.saved ? mainApi.deleteSavedMovie(card._id) : mainApi.saveMovie(card)

    promise
      .then(() => mainApi.getSavedMovies())
      .then(({ data }) => {
        const cards = data.map((card) => {
          card.saved = true;
          return card;
        })

        localStorage.setItem('saved-movies', JSON.stringify(cards));
        setSavedMovies(() => cards);



        const mergedMovies = mergeMovies(movies, cards)

        setMovies(() => mergedMovies);

        // Сохраняем исходный массив фильмов в localStorage.
        localStorage.setItem('movies', JSON.stringify(mergedMovies));

      })
  };


  useEffect(() => {
    const savedSearchName = localStorage.getItem("search-name-saved") || "";
    const savedSearchShorts = (localStorage.getItem("search-isShorts-saved") === "true") ? true : false;

    filterSavedMovies(savedSearchName, savedSearchShorts)
  }, [savedMovies.length])


  // Обработчик удаления фильма из избранного со страницы "Сохраненное".
  const handleDeleteSavedMovie = (serverId, localId) => {
    console.log("1-saved-удаление лайка")
    mainApi.deleteSavedMovie(serverId) // Удяляем фильм из БД.
      .then((res) => {
        // toggleFavouritesMoviesInLocal(localId); // Удаляем лайки из localstorage.
        console.log("5-saved-удалили лайк из БД")
        foundSavedMoviesData.forEach((item, index) => { // Удаляем фильм из массива "Сохраненные фильмы".
          if (item._id === serverId) {
            console.log("6-saved-нашли фильм в стэйте и удалили")
            delete foundSavedMoviesData[index];
            setFoundSavedMoviesData(foundSavedMoviesData);
          }

        });
        setNeedUpdate(true);
        console.log("NeedUpdate", needUpdate)
        setIsFiltering(false);
        console.log("IsFiltering", isFiltering)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        {compareUrl(urlHeaderRender) ? <Header loggedIn={loggedIn} isMainPage={isMainPage} togglePopupMenu={togglePopupMenu} /> : null}

        <Routes>
          <Route exact path='/' element={<Main />}>
          </Route>
          <Route path='/movies' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Movies
                filterMovies={filterMovies}
                isNoMoviesFound={isNoMoviesFound}
                isLoadingData={isLoadingMoviesData}
                isMoviesApiError={isMoviesApiError}
                onSubmit={handleSearchMovies}
                moviesData={filteredMovies}
                onSaveMovie={handleSaveFavoriteMovie}
              />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/saved-movies' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <SavedMovies
                needUpdate={needUpdate}
                isFiltering={isFiltering}
                loadSavedMoviesData={loadSavedMoviesData}
                isSavedMoviesEmpty={isSavedMoviesEmpty}
                isLoadingData={isLoadingMoviesData}
                isNoSavedMoviesFound={isNoSavedMoviesFound}
                savedMovies={filteredSavedMovies}
                handleSearchSavedMovies={filterSavedMovies}
                onSaveMovie={handleSaveFavoriteMovie}
                isFavouritesMoviesApiError={isFavouritesMoviesApiError}
              />
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
