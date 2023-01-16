import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login({ handleLogin }) {

  // States.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // функции обработчики.
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const resetForm = () => {
    setEmail("");
    setPassword("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, resetForm);
  }

  return (
    <section className="auth">
      <Link className="button logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      <h1 className="common-title">Рады видеть!</h1>

      <form
        name="login"
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <label className="auth-form__label">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          aria-label="Введите email"
          name="email"
          value={email}
          onChange={handleChangeEmail}
          className="auth-form__input auth-form__input_login input"
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
          className="auth-form__input auth-form__input_login input"
          required
        />
        <span className="auth-form__input-error"></span>

        <button
          name="submit"
          className="auth-form__submit auth-form__submit_login button"
          type="submit"
          aria-label="Войти"
          title="Войти"
        >
          Войти
        </button>
        <p className="auth-form__text">
          Ещё не зарегистрированы?
          <Link to="/signup" className="auth-form__link link">
            {" "}
            Регистрация
          </Link>
        </p>
      </form>

    </section>
  );
}

export default Login;
