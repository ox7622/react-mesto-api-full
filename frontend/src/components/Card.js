import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Card({ card, onCardClick, onLikeClick, onDeleteCard }) {
    const user = useContext(CurrentUserContext)
    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = card.owner._id === user._id;

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
        `card__delete ${isOwn ? 'card__delete' : 'card__delete_hide'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some(i => i._id === user._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `card__like ${isLiked ? 'card__like_active' : 'card__like'}`
    );
    function handleCardDelete() {
        onDeleteCard(card);
    };

    function handleLikeClick() {
        onLikeClick(card);
    };

    function handleClick() {
        onCardClick(card);
    };

    return (
        <li className="card" >
            <img className="card__img" src={card.link} alt={card.name} onClick={handleClick} />
            <button className={cardDeleteButtonClassName} type="button" aria-label="удалить" onClick={handleCardDelete}></button>
            <div className="card__title-group">
                <h2 className="card__title">{card.name}</h2>
                <div>
                    <button className={cardLikeButtonClassName} type="button" aria-label="нравится" onClick={handleLikeClick}></button>
                    <p className="card__like-count">{card.likes.length}</p>
                </div>
            </div>
        </li>
    )
}

export default Card;