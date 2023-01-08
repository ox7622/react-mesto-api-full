
function PopupWithForm({ isOpen, name, children, buttonTitle, title, onClose, onSubmit, setButtonState }) {
   
    return (
        <div className={`popup popup_${name} ${isOpen ? "popup_open" : ""}`} >
            <div className="popup__container">
                <button className="popup__close" type="button" aria-label="закрыть окно" onClick={onClose}></button>
                <form className={`popup__form popup__form_type_${name}`} name={`${name}`} onSubmit={onSubmit} noValidate >
                    <h2 className={`popup__title popup__title_type_${name}`}>{title}</h2>
                    {children}
                    <button className={`popup__submit ${setButtonState ? "popup__submit_disabled" : null}`} disabled={setButtonState} type="submit">{buttonTitle}</button>
                </form>
            </div>
        </div>
    )
}
export default PopupWithForm;