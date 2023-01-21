import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function Profile({ onEditProfile, handleLogout }) {

  // Получаем данные текущего пользователя.
  const currentUser = useContext(CurrentUserContext);

  // States.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [textError, setTextError] = useState("");
  const [isEditDone, setIsEditDone] = useState(false);
  const [inputNameError, setInputNameError] = useState("");
  const [inputEmailError, setInputEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Записываем данные текущего пользователя в стейты для дальнейшего сравнения.
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setNewName(currentUser.name);
    setNewEmail(currentUser.email);
  }, [currentUser]);

  function makeFinalValidation() {
    setIsEditDone(false);
    if (name === newName || email === newEmail) {
      setTextError('Измените оба поля');
      setIsFormValid(false);
      return;
    }

    if (!isNameValid || !isEmailValid) {
      setTextError('');
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);
  }

  // Обработчики полей ввода имени и email.
  function handleChangeName(e) {
    let inputValue = e.target.value;
    setNewName(inputValue);
    setTextError("");
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z -]+$/g

    if (inputValue.length < 2 || inputValue.length > 30) {
      setInputNameError('Длина имени от 2 до 30 символов')
      setIsNameValid(false);
    } else if (!nameRegex.test(String(inputValue))) {
      setInputNameError('Имя не соответствует шаблону: [а-яА-Яa-zA-Z -]')
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
      setInputNameError("");
    }
  }

  function handleChangeEmail(e) {
    let inputValue = e.target.value;
    setNewEmail(inputValue);
    setTextError("");

    const emailRegex = /^([\w]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (inputValue.length === 0) {
      setInputEmailError('e-mail не должен быть пустым');
      setIsEmailValid(false);
    } else if (!emailRegex.test(String(inputValue).toLowerCase())) {
      setInputEmailError('Введите корректный e-mail');
      setIsEmailValid(false);
    } else {
      setIsEmailValid(true);
      setInputEmailError('');
    }
  }

  useEffect(() => {
    makeFinalValidation();
  }, [newName, newEmail])


  // Обработчик сохранения изменений.
  function handleUpdateUser(e) {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onEditProfile(newName, newEmail, setTextError, setIsEditDone);
    console.log('Отправилось')
  }


  return (
    <section className="profile">
      <h1 className="common-title">Привет, Сергей!</h1>

      <form className="profile-form" name="profile-form">
        <div className="profile-form__container">
          <div className="profile-form__input-container">
            <label className="profile-form__label">Имя</label>
            <input
              className="profile-form__input input"
              type="text"
              id="profile-name"
              aria-label="Введите имя"
              placeholder="Имя"
              name="profile-name"
              value={newName}
              onChange={handleChangeName}
              required
            />
          </div>
          <span className="auth-form__input-error">{inputNameError}</span>
        </div>
        <div className="profile-form__container">
          <div className="profile-form__input-container">
            <label className="profile-form__label">E-mail</label>
            <input
              className="profile-form__input input"
              type="email"
              id="profile-email"
              aria-label="Введите email"
              placeholder="Email"
              name="profile-email"
              value={newEmail}
              onChange={handleChangeEmail}
              required
            />
          </div>
          <span className="auth-form__input-error">{inputEmailError}</span>
        </div>
        <span className={`profile-form__info-message ${isEditDone ? "profile-form__info-message_positive" : ""}`}>{textError || (isEditDone && "Данные обновлены")}</span>
        <button
          className={`profile-form__submit button ${isFormValid ? "" : "profile-form__submit_inactive"}`}
          type="submit"
          title="Редактировать профиль"
          aria-label="Редактировать профиль"
          onClick={handleUpdateUser}
          disabled={!isFormValid}
        >Редактировать</button>
        <button
          className="profile-form__submit profile-form__submit_exit button"
          type="submit"
          title="Выйти из аккаунта"
          aria-label="Выйти из аккаунта"
          onClick={handleLogout}
        >Выйти из аккаунта</button>
      </form>

    </section>
  );
}

export default Profile;
