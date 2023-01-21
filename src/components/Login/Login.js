import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Login({ handleLogin }) {

  // States.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputEmailError, setInputEmailError] = useState("");
  const [inputPasswordError, setInputPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  // Сброс формы.
  const resetForm = () => {
    setEmail("");
    setPassword("");
  }

  // Обработка нажатия на кнопку "Войти".
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, resetForm, setIsLoginError);
  }

  // Финальная валидация отвечает за блокировку / разблокировку формы.
  function makeFinalValidation() {
    setIsLoginError(false);
    if (!isEmailValid || !isPasswordValid) {
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);
  }

  // Обработчики полей ввода email и пароля.
  function handleChangeEmail(e) {
    let inputValue = e.target.value;
    setEmail(inputValue);

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

  function handleChangePassword(e) {
    let inputValue = e.target.value;
    setPassword(inputValue);

    if (inputValue.length === 0) {
      setInputPasswordError('Пароль не должен быть пустым')
      setIsPasswordValid(false);
    } else {
      setInputPasswordError('')
      setIsPasswordValid(true);
    }
  }


  useEffect(() => {
    makeFinalValidation();
  }, [email, password])

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
        <span className="auth-form__input-error">{inputEmailError}</span>
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
        <span className="auth-form__input-error">{inputPasswordError}</span>
        <span className="auth-form__info-message auth-form__info-message_login">{isLoginError && "Произошла ошибка! Попробуйте ещё раз."}</span>

        <button
          name="submit"
          className={`auth-form__submit button ${isFormValid ? "" : "auth-form__submit_inactive"}`}
          type="submit"
          aria-label="Войти"
          title="Войти"
          disabled={!isFormValid}
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
