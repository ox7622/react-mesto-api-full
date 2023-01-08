import { useState, useEffect, useCallback } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Switch, Route, Redirect } from "react-router-dom";
import * as authUser from '../auth.js';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute';
import Main from './Main';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import { ConfirmPopup } from './ConfirmPopup';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import api from "../utils/api";
import InfoTooltip from './InfoTooltip';
import Footer from './Footer';

const App = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [currentUser, setCurrentUser] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const [isLoginOk, setLoginOk] = useState(false);
    const [isLoginFail, setLoginFail] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);

    const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);

    const [selectedCard, setCard] = useState({});
    const [cards, setCards] = useState([]);
    const [cardDelete, setCardDelete] = useState({});

    const isOpen = isEditAvatarPopupOpen || isAddPlacePopupOpen || isEditProfilePopupOpen || isConfirmPopupOpen || selectedCard.link || regSuccess || isLoginFail || isLoginOk;


    const tokenCheck = useCallback(async () => {
        try {
            setIsLoading(true);
            const jwt = localStorage.getItem("token");
            if (!jwt) {
                throw new Error('no token');
            }
            const user = await authUser.checkToken(jwt);
            if (user) {
                setLoggedIn(true);
                setUserEmail(localStorage.getItem('email'));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }, []);

    const handleLogin = useCallback(async ({ password, email }) => {
        try {
            setIsLoading(true);
            const data = await authUser.login({ password, email });

            if (data.token) {

                localStorage.setItem('token', data.token);
                setUserEmail(localStorage.getItem('email'));
                setLoggedIn(true);
                setMessage("Добро пожаловать!");
                setLoginOk(true);
            }

        } catch (err) {
            setMessage(err.message || "Что-то пошло не так! Попробуйте ещё раз.");
            setLoginFail(true)

        }
        finally {
            setIsLoading(false);
        }

    }, []);


    const handleReg = useCallback(async ({ password, email }) => {
        try {
            setIsLoading(true);
            const data = await authUser.register({ password, email });
            if (data) {
                setRegSuccess(true);
                setMessage('Вы успешно зарегистрировались!')
                setLoginOk(true);
                window.localStorage.setItem('email', data.data.email);
            }
        } catch (err) {
            setMessage(err || "Что-то пошло не так! Попробуйте ещё раз.");
            setLoginFail(true);
        }
        finally {
            setIsLoading(false);
        }
    }, [])


    useEffect(() => {
        if (localStorage.getItem('token')) {
            tokenCheck();
        }
    }, [tokenCheck])


    useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getProfileInfo(), api.getCardsInfo()]).then(([userInfo, cardsInfo]) => {
                setCurrentUser(userInfo);
                setCards(cardsInfo);
            }).catch((err) => console.log("запрос на получение данных профиля не выполнен: " + err));
        }
    }, [loggedIn]);



    const handleUpdateUser = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const res = await api.editProfileInfo(data);
            if (res) {
                setCurrentUser(res);
                closeAllPopups();
            }
            throw new Error('user data request error');

        } catch (err) {
            console.log("запрос на обновление данных профиля не выполнен: " + err)
        } finally {
            setIsLoading(false)
        }
    }, [])


    const handleUpdateAvatar = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const res = await api.changeAvatar(data);
            if (res) {
                setCurrentUser(res);
                closeAllPopups();
            }
        } catch (err) {
            console.log("запрос на смену аватара не выполнен: " + err)
        } finally {
            setIsLoading(false)
        }
    }, []);

    const handleCardClick = useCallback((cardItem) => {
        setCard(cardItem)
    }, [])

    const handleEditAvatarClick = useCallback(() => {
        setAvatarPopupOpen(true);
    }, [])

    const handleAddPlaceClick = useCallback(() => {
        setPlacePopupOpen(true);
    }, [])

    const handleEditProfileClick = useCallback(() => {
        setProfilePopupOpen(true);
    }, [])

    const closeAllPopups = useCallback(() => {
        setProfilePopupOpen(false);
        setPlacePopupOpen(false);
        setAvatarPopupOpen(false);
        setConfirmPopupOpen(false);
        setCard({});
        setLoginFail(false);
        setLoginOk(false);
        setRegSuccess(false);
    }, [])

    const handleCardLike = useCallback((card) => {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        if (isLiked) {
            api.removeLike(card._id).then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
                .catch((err) => console.log("запрос на удаление лайка не выполнен: " + err));

        } else {
            api.setLike(card._id).then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
                .catch((err) => console.log("запрос на отправку лайка не выполнен: " + err));
        }
    }, [])

    const handleConfirmDelete = useCallback((card) => {
        setCardDelete(card);
        setConfirmPopupOpen(true);
    }, [])

    const handleCardDelete = useCallback(async (card) => {
        try {
            setIsLoading(true);
            const res = api.deleteCard(card._id);
            setCards((state) => state.filter((c) => c._id !== card._id));
            closeAllPopups();
        } catch (err) {
            console.log("запрос на удаление картинки не выполнен: " + err)
        } finally {
            setIsLoading(false);
        }

    }, [])


    const handleAddPlaceSubmit = useCallback(async function (data) {
        try {
            setIsLoading(true);
            const res = await api.sendCardData(data);
            if (res) {
                setCards([res, ...cards]);
                closeAllPopups();
            }
            throw new Error("add place request error");

        } catch (e) {
            console.log("запрос на добавление картинки не выполнен: " + e);
        } finally {
            setIsLoading(false);
        }

    })

    const handleLogout = useCallback(() => {
        setLoggedIn(false);
        localStorage.removeItem('token');
    }, [])


    useEffect(() => {
        function closeOnEscape(e) {
            if (e.key === "Escape") {
                closeAllPopups();
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', closeOnEscape);
        }
        return () => {
            document.removeEventListener('keydown', closeOnEscape);
        }
    }, [isOpen])


    return (
        <div>
            <CurrentUserContext.Provider value={currentUser}>

                <Switch>
                    <ProtectedRoute
                        path="/react-mesto-auth/main"
                        loggedIn={loggedIn}
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        cards={cards}
                        onCardLike={handleCardLike}
                        onCardDelete={handleConfirmDelete}
                        userEmail={userEmail}
                        handleLogout={handleLogout}
                    />

                    <Route path="/react-mesto-auth/sign-in">
                        <Login isLoggedIn={loggedIn} onLogin={handleLogin} buttonText={isLoading ? "Вхожу..." : "Вход"} />
                    </Route>
                    <Route path="/react-mesto-auth/sign-up">
                        <Register isLoggedIn={regSuccess} onRegister={handleReg} buttonText={isLoading ? "Регистрирую..." : "Зарегистрироваться"} />
                    </Route>

                    <Route>
                        {loggedIn ? <Redirect to='/react-mesto-auth/main' /> : <Redirect to="/react-mesto-auth/sign-in" />}
                    </Route>
                </Switch>
                <Footer />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                <InfoTooltip
                    isOpen={regSuccess || isLoginOk}
                    name="ok"
                    title={message}
                    onClose={closeAllPopups} />
                <InfoTooltip
                    isOpen={isLoginFail}
                    name="fail"
                    title={message}
                    onClose={closeAllPopups} />
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    buttonText={isLoading ? "Сохраняю..." : "Сохранить"}></EditProfilePopup>
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                    buttonText={isLoading ? "Создаю..." : "Создать"}></AddPlacePopup>
                <PopupWithForm
                    title="Вы уверены?"
                    name="confirm"
                    isOpen={false}
                    buttonTitle="Да" />
                <EditAvatarPopup
                    onClose={closeAllPopups}
                    isOpen={isEditAvatarPopupOpen}
                    onUpdateAvatar={handleUpdateAvatar}
                    buttonText={isLoading ? "Сохраняю..." : "Сохранить"} ></EditAvatarPopup>
                <ConfirmPopup
                    onClose={closeAllPopups}
                    isOpen={isConfirmPopupOpen}
                    card={cardDelete}
                    onDeleteConfirm={handleCardDelete}
                    buttonText={isLoading ? "Удаляю..." : "Да"} ></ConfirmPopup>
            </CurrentUserContext.Provider>
        </div>);
}

export default App;
