import React from "react";

function Profile() {
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
            placeholder="Сергей"
            name="profile-name"
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
            placeholder="pochta@yandex.ru"
            name="profile-email"
            required
          />
        </div>

        <span className="profile-form__input-error"></span>

        <button
          className="profile-form__submit button"
          type="submit"
          title="Редактировать профиль"
          aria-label="Редактировать профиль"
        >Редактировать</button>
        <button
          className="profile-form__submit profile-form__submit_exit button"
          type="submit"
          title="Выйти из аккаунта"
          aria-label="Выйти из аккаунта"
        >Выйти из аккаунта</button>
      </form>



    </section>
  );
}

export default Profile;
