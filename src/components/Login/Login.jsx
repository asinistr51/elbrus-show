import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/action';
import firebase from '../../FireBaseConnection';
import { useHistory } from 'react-router-dom';

import { useInputs, submit } from '../Input/Input';

const Login = () => {
  const history = useHistory();
  const [inputs, setInputs] = useInputs({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  // const userRef = firebase.database().ref('users/-MF-RBlqqh4xVvu_AL-5');
  // userRef.once('value').then((data) => (data.val()));

  return (
    <>
      <div className="user_forms-login">
        <h2 className="forms_title">Авторизация</h2>
        <form className="forms_form">
          <fieldset className="forms_fieldset">
            <div className="forms_field">
              <input
                className="forms_field-input"
                placeholder="Email"
                name="email"
                required
                autoFocus
                value={inputs.email}
                onChange={setInputs}
                type="email"
              />
            </div>
            <div className="forms_field">
              <input
                type="password"
                placeholder="Пароль"
                className="forms_field-input"
                name="password"
                value={inputs.password}
                onChange={setInputs}
                required
              />
            </div>
          </fieldset>
          <div className="forms_buttons">
            <div></div>
            <input
              type="submit"
              value="Войти"
              className="forms_buttons-action"
              onClick={async (e) => {
                e.preventDefault();
                const loginData = await submit(inputs, 'signInWithPassword');
                if (loginData.message === 'EMAIL_NOT_FOUND') {
                  alert('Такой Email не найден!');
                  return;
                } else if (loginData.message === 'INVALID_PASSWORD') {
                  alert('Неверный пароль!');
                  return;
                } else if (loginData.message) {
                  alert('Что-то пошло не так!');
                  return;
                }

                console.log('loginData> ', loginData);
                const ref = firebase.database().ref('users');
                ref
                  .orderByChild('localId')
                  .equalTo(loginData.localId)
                  .once('value', function (snapshot) {
                    console.log(snapshot.val());
                    const userFromFireBase = snapshot.val();
                    const user = {
                      localId: loginData.localId,
                      displayName: loginData.displayName,
                    };
                    for (let key in userFromFireBase) {
                      user.IDuserInCollectionFB = key;
                      if (user.localId !== userFromFireBase[key].localId) {
                        console.log(
                          'Почему-то не совпадают данные localId авторизации FireBase и localId юзера вернувшегося из коллекции Users FireBase'
                        );
                      }
                      if (userFromFireBase.wishList === undefined) {
                        user.wishList = [];
                      }
                      if (userFromFireBase.favoriteList === undefined) {
                        user.favoriteList = [];
                      }
                    }
                    document.cookie = `user_auth_id=${loginData.localId}; max-age=${loginData.expiresIn}`;
                    document.cookie = `user_id=${user.IDuserInCollectionFB}; max-age=${loginData.expiresIn}`;
                    dispatch(setUser(user));
                    history.push('/films');
                  });
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
