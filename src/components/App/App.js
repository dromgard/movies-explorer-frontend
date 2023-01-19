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
  const [loggedIn, setLoggedIn] = useState(false);

  // States для фильмов.
  const [isNoMoviesFound, setIsNoMoviesFound] = useState(false); // Поиск фильма ничего не нашел "Фильмы".
  const [isNoSavedMoviesFound, setIsNoSavedMoviesFound] = useState(false); //Результат поиска на странице "Сохраненные Фильмы"
  const [isLoadingMoviesData, setIsLoadingMoviesData] = useState(false); // Идёт загрузка. Прелоадер.
  const [foundSavedMoviesData, setFoundSavedMoviesData] = useState([]); // Массив "Сохраненные Фильмы"
  const [moviesData, setMoviesData] = useState([]); // Результат поиска на странице "Фильмы"
  const [getSavedMoviesResStatus, setGetSavedMoviesResStatus] = useState(null); //Ошибки АПИ после поиска "Сохраненные Фильмы".
  const [isSavedMoviesEmpty, setIsSavedMoviesEmpty] = useState(false); // Поиск фильма ничего не нашел "Сохраненные Фильмы".
  const [moviesApiResStatus, setMoviesApiResStatus] = useState(null); // Ошибки АПИ после поиска "Фильмы".

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

  // Обработчик логина.
  const handleLogin = (userEmail, userPassword, resetLoginForm) => {
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
    localStorage.clear();
    setCurrentUser({});
    setMoviesData([]);
    setFoundSavedMoviesData([]);
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

  // // Обработчик получения фильмов.
  // function handleGetMovies(request, filtercheckbox) {
  //   moviesApi
  //     .getMoviesCards()
  //     .then((moviesCards) => {
  //       console.log(moviesCards);
  //       localStorage.setItem("request", request);
  //       localStorage.setItem("moviesCards", moviesCards);
  //       localStorage.setItem("filtercheckbox", filtercheckbox);
  //     })
  //     .catch((err) => {
  //       console.log(`Ошибка загрзуки фильмов: ${err}`);
  //     });
  // }

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
  const handleSearchMoviesData = (request, filtercheckbox) => {
    // 1 этап. Выполняем поиск фильмов и сохраняем данные в localStorage.
    setIsLoadingMoviesData(true);
    localStorage.setItem("request", request);
    localStorage.setItem("filtercheckbox", filtercheckbox);

    moviesApi.getMoviesCards()
      .then((res) => {
        // setMoviesApiResStatus(res.status);

        // Сохраняем исходный массив фильмов в localStorage.
        localStorage.setItem('movies', JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
        setMoviesApiResStatus(err)
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
      localStorage.setItem('filtered-previously-movies', JSON.stringify(filteredMovies));

      // Сохраняем фильтрованный массив фильмов в state.
      // setMoviesData(markAsSaved(filteredMovies));
      setMoviesData(filteredMovies);

    }
  };

  // Загрузка всех сохраненных фильмов с Api.
  const loadSavedMoviesData = () => {
    mainApi.getSavedMovies()
      .then((res) => {
        setGetSavedMoviesResStatus(res.status);

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
        setMoviesApiResStatus(err)
      })

  }

  // Поиск фильмов на странице "Сохраненные фильмы".
  // const handleSearchSavedMoviesData = (request, filtercheckbox, isAfterDelete = false) => {
  //   const token = localStorage.getItem('jwt');

  //   if (token) {
  //     mainApi.getSavedMovies(token)
  //       .then((res) => {
  //         setGetSavedMoviesResStatus(res.status);

  //         if (res.data.length === 0) {
  //           setIsSavedMoviesEmpty(true);
  //           setFoundSavedMoviesData(res.data);
  //           return;
  //         } else {
  //           setIsSavedMoviesEmpty(false);
  //         }

  //         const savedMoviesData = res.data.reverse();

  //         const filteredSavedMovies = searchFilter(request, filtercheckbox, savedMoviesData);

  //         if (filteredSavedMovies.length === 0) {
  //           setIsNoSavedMoviesFound(true);
  //         } else {
  //           setIsNoSavedMoviesFound(false);
  //         }
  //         setFoundSavedMoviesData(filteredSavedMovies)
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setMoviesApiResStatus(err)
  //       })
  //   }
  // }




  // Поиск фильмов на странице "Сохраненные фильмы".
  const handleSearchSavedMoviesData = (request, filtercheckbox) => {
    const filteredSavedMovies = searchFilter(request, filtercheckbox, foundSavedMoviesData);

    if (filteredSavedMovies.length === 0) {
      setIsNoSavedMoviesFound(true);
    } else {
      setIsNoSavedMoviesFound(false);
    }
    setFoundSavedMoviesData(filteredSavedMovies)

  }

  // Проверка на логин при загрузке страницы.
  useEffect(() => {
    tokenCheck();
  }, [loggedIn]);


  // const getInitialSavedMoviesIds = () => {
  //   const initialSavedMoviesIds = [];

  //   foundSavedMoviesData.forEach((savedMovie) => {
  //     initialSavedMoviesIds.push(savedMovie.movieId);
  //   });

  //   return initialSavedMoviesIds;
  // };

  // const markAsSaved = (foundMoviesArr) => {
  //   const initialSavedMoviesIdsArr = getInitialSavedMoviesIds();
  //   foundMoviesArr.forEach((foundMovie) => {
  //     foundMovie.saved = initialSavedMoviesIdsArr.some((savedMovieId) => savedMovieId === foundMovie.id);
  //   })

  //   foundSavedMoviesData.forEach((savedMovie) => {
  //     foundMoviesArr.forEach((foundMovie) => {
  //       if (foundMovie.id === savedMovie.movieId) {
  //         foundMovie._id = savedMovie._id;
  //       }
  //     })
  //   })
  //   return foundMoviesArr;
  // }

  // Управляем лайками в локал localStorage.
  const toggleFavouritesMoviesInLocal = (id) => {
    // Получаем текущий массив сохраненок.
    const filteredMovies = JSON.parse(localStorage.getItem('filtered-previously-movies'));

    // Находим фильм с нужным id и ставим/удаляем лайк.
    filteredMovies.forEach((foundMovie) => {
      if (foundMovie.id === id) {
        // Нашли фильм и проверяем стоит ли лайк
        if (foundMovie.saved) {
          foundMovie.saved = false
        } else {
          foundMovie.saved = true
        }
      }
    })

    // Сохраняем новый массив в localStorage.
    localStorage.setItem('filtered-previously-movies', JSON.stringify(filteredMovies));
    setMoviesData(filteredMovies);
  }


  // Находим id фильма с сервера для удаления из избранного.
  const getSavedMoviesForPageMovies = (cardLocalId) => {
    return mainApi.getSavedMovies()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        // setMoviesApiResStatus(err)
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
        // setOpenNotificationModal();
        // setNotificationText(`${DELETE_MOVIE_ERROR_TEXTS.BASE_TEXT} ${err}`)
        console.log(err);
      })
      .finally(() => {
        toggleFavouritesMoviesInLocal(id)
        console.log("Удалили из фильмы local")
      })



  }


  // Обработчик сохранения фильма в избранное.
  const handleSaveFavoriteMovie = (data) => {
    const token = localStorage.getItem('jwt'); // Удалить
    if (token) {
      mainApi.saveMovie(data, token)
        .then((res) => {
        })
        .catch((err) => {
          // setOpenNotificationModal();
          // setNotificationText(`${SAVE_MOVIE_ERROR_TEXTS.BASE_TEXT} ${err}`)
          console.log(err);
        })
        .finally(() => {
          // handleSearchSavedMoviesData();
          toggleFavouritesMoviesInLocal(data.movieId);
        })
    } else {
      // history.push('/signin');
      console.log('пользователь не найден')
    };
  };

  // const markAsUnsaved = (id) => {
  //   moviesData.forEach((movie) => {
  //     if (movie.saved) {
  //       if (movie._id === id) {
  //         delete movie.saved;
  //         delete movie._id;
  //       }
  //     }
  //   })
  // }

  // Обработчик удаления фильма из избранного.
  const handleDeleteSavedMovie = (serverId, localId) => {

    const token = localStorage.getItem('jwt'); // Удалить

    if (token) {
      mainApi.deleteSavedMovie(serverId, token) // Удяляем фильм из БД.
        .then((res) => {
          toggleFavouritesMoviesInLocal(localId); // Удяляем лайки из localstorage.

          foundSavedMoviesData.forEach((item, index) => {
            if (item._id === serverId) {
              delete foundSavedMoviesData[index];
              setFoundSavedMoviesData(foundSavedMoviesData);
            }

          });

        })
        .catch((err) => {
          // setOpenNotificationModal();
          // setNotificationText(`${DELETE_MOVIE_ERROR_TEXTS.BASE_TEXT} ${err}`)
          console.log(err);
        })
        .finally(() => {
          // toggleFavouritesMoviesInLocal(data.movieId);

        })
    };
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
                isNoMoviesFound={isNoMoviesFound}
                isLoadingData={isLoadingMoviesData}
                resStatus={moviesApiResStatus}
                onSubmit={handleSearchMoviesData}
                // moviesData={markAsSaved(moviesData)}
                moviesData={moviesData}
                onSaveMovie={handleSaveFavoriteMovie}
                onDeleteSavedMovie={deleteSavedMovieForPageMovies}
              />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/saved-movies' element={
            <ProtectedRoute loggedIn={loggedIn}>
              <SavedMovies
                loadSavedMoviesData={loadSavedMoviesData}
                isSavedMoviesEmpty={isSavedMoviesEmpty}
                isLoadingData={isLoadingMoviesData}
                isNoSavedMoviesFound={isNoSavedMoviesFound}
                savedMovies={foundSavedMoviesData}
                handleSearchSavedMoviesData={handleSearchSavedMoviesData}
                onDeleteSavedMovie={handleDeleteSavedMovie}
                getSavedMoviesResStatus={getSavedMoviesResStatus}
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
