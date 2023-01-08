export default function InfoTooltip({ isOpen, name, title, onClose }) {
    return (
        <div className={`popup popup_${name} ${isOpen ? "popup_open" : ""}`} >
            <div className="popup__container">
                <button className="popup__close" type="button" aria-label="закрыть окно" onClick={onClose}></button>
                {/* <form className={`popup__form popup__form_type_${name}`} name={`${name}`} onSubmit={onSubmit} > */}
                <div className={`popup__image ${name == 'ok' ? "popup__image_ok" : "popup__image_fail"}`}></div>
                <h2 className={`popup__title popup__title_type_tooltip`}>{title}</h2>
                {/* <button className="popup__submit" type="submit">{buttonTitle}</button>
            </form> */}
            </div>
        </div>
    )
}