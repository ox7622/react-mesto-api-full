function ImagePopup({card, onClose}) {
    return (
        <div className={`popup popup_view-image ${card.link ? "popup_open" : ""}`}>
            <div className="popup__image-container">
                <button className="popup__close" type="button" aria-label="закрыть окно" onClick={onClose}></button>
                <img className="popup__image" src={card.link} alt={card.name} />
                <p className="popup__title popup__title_type_large-view ">{card.name} </p>
            </div>
        </div>
    )
}
export default ImagePopup;