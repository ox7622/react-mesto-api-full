import PopupWithForm from "./PopupWithForm";

export function ConfirmPopup({ card, isOpen, onClose, onDeleteConfirm, buttonText }) {

    function handleSubmit(e) {
        e.preventDefault();
        onDeleteConfirm(card)
    }

    return (
        <PopupWithForm
            title="Вы уверены?"
            name="confirm"
            buttonTitle={buttonText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}></PopupWithForm>
    )
}