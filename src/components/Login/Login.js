import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="auth">
      <Link className="button header__logo" to="/" aria-label="Перейти на страницу 'О Проекте'" />
      <h1 className="common-title">Рады видеть!</h1>

      <form
        name="login"
        className="auth-form"
      >
        <label className="auth-form__label">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          aria-label="Введите email"
          name="email"
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
