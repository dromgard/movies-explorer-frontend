import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ handleRegister }) {

  // States.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // функции обработчики.
  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email, password, name, resetForm);
  }


  return (
    <section className="auth">
      <Link className="button logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      <h1 className="common-title">Добро пожаловать!</h1>

      <form
        name="register"
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <label className="auth-form__label">Имя</label>
        <input
          id="name"
          type="text"
          placeholder="Имя"
          aria-label="Введите имя"
          name="name"
          value={name}
          onChange={handleChangeName}
          className="auth-form__input input"
          required
        />
        <span className="auth-form__input-error"></span>
        <label className="auth-form__label">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          aria-label="Введите email"
          name="email"
          value={email}
          onChange={handleChangeEmail}
          className="auth-form__input input"
          required
        />
        <span className="auth-form__input-error"></span>
        <label className="auth-form__label">Пароль</label>
        <input
          id="password"
          type="password"
          placeholder="Пароль"
          aria-label="Введите пароль"
          name="password"
          value={password}
          onChange={handleChangePassword}
          className="auth-form__input input"
          required
        />
        <span className="auth-form__input-error"></span>

        <button
          name="submit"
          className="auth-form__submit button"
          type="submit"
          aria-label="Зарегистрироваться"
          title="Зарегистрироваться"
        >
          Зарегистрироваться
        </button>
        <p className="auth-form__text">
          Уже зарегистрированы?
          <Link to="/signin" className="auth-form__link link">
            {" "}
            Войти
          </Link>
        </p>
      </form>

    </section>
  );
}

export default Register;
