import Card from "./Card";
import { useContext } from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import { Link } from "react-router-dom";

function Main({ onAddPlace, onCardClick, onEditAvatar, onEditProfile, cards, onCardLike, onCardDelete, userEmail, handleLogout }) {

    const user = useContext(CurrentUserContext);

    return (
        <>
            <Header>
                <li><Link to="#"
                    className="header__link header__link_type_user">{userEmail}</Link>
                </li>
                <li><Link to="sign-in"
                    className="header__link header__link_type_logout"
                    onClick={handleLogout}>Выйти</Link>
                </li>
            </Header>
            <main className="content">
                <section className="profile">
                    <div className="profile__avatar" onClick={onEditAvatar} style={{ backgroundImage: `url(${user.avatar})` }} ></div>
                    <div className="profile__text-grid">
                        <h1 className="profile__name">{user.name}</h1>
                        <button className="profile__edit-profile" type="button" aria-label="редактировать профиль" onClick={onEditProfile}></button>
                        <p className="profile__role">{user.about}</p>
                    </div>
                    <button className="profile__add-photo" type="button" aria-label="добавить фото" onClick={onAddPlace}></button>
                </section>
                <section className="photos">
                    <ul className="cards">
                        {cards.map(item => (
                            <Card
                                card={item}
                                key={item._id}
                                onCardClick={onCardClick}
                                onLikeClick={onCardLike}
                                onDeleteCard={onCardDelete} />))}
                    </ul>
                </section>
            </main>
        </>
    )
}
export default Main;