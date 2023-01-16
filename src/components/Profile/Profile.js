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

  // Записываем данные текущего пользователя в стейты для дальнейшего сравнения.
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setNewName(currentUser.name);
    setNewEmail(currentUser.email);
  }, [currentUser]);

  // Обработчики полей ввода имени и email.
  function handleChangeName(e) {
    setNewName(e.target.value);
    setTextError("");
  }

  function handleChangeEmail(e) {
    setNewEmail(e.target.value);
    setTextError("");
  }

  // Обработчик сохранения изменений.
  function handleUpdateUser(e) {
    e.preventDefault();

    // Проверяем, что пользователь ввёл новые данные.
    if (name === newName || email === newEmail) {
      setTextError('Введите новые данные');
      return;
    }
    // Передаём значения управляемых компонентов во внешний обработчик
    onEditProfile(newName, newEmail);
  }

  return (
    <section className="profile">
      <h1 className="common-title">Привет, Сергей!</h1>

      <form className="profile-form" name="profile-form">
        <div className="profile-form__container">
          <label className="profile-form__label">Имя</label>
          <input
            className="profile-form__input input"
            type="text"
            id="profile-name"
            aria-label="Введите имя"
            placeholder="Имя"
            name="profile-name"
            value={newName || name}
            onChange={handleChangeName}
            required
          />
        </div>
        <div className="profile-form__container">
          <label className="profile-form__label">E-mail</label>
          <input
            className="profile-form__input input"
            type="email"
            id="profile-email"
            aria-label="Введите email"
            placeholder="Email"
            name="profile-email"
            value={newEmail || email}
            onChange={handleChangeEmail}
            required
          />
        </div>

        <span className="profile-form__input-error">{textError}</span>

        <button
          className="profile-form__submit button"
          type="submit"
          title="Редактировать профиль"
          aria-label="Редактировать профиль"
          onClick={handleUpdateUser}
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
