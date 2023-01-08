import { useRef } from "react";
import { useForm } from "../hooks/useForm";
import PopupWithForm from "./PopupWithForm";

export function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, buttonText }) {
    const avatarLink = useRef();
    const { values, handleChange } = useForm({});
    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            avatar: avatarLink.current.value
        })
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="change-avatar"
            buttonTitle={buttonText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            setButtonState={values.avatar_buttonState}
             >
            <input
                className="popup__input popup__input_field_avatar-link"
                ref={avatarLink}
                type="url"
                name="avatar"
                id="avatar-link-input"
                onChange={handleChange}
                required
                placeholder="Ссылка на картинку" />
            <span className="input-error">{ values.avatar_error }</span></PopupWithForm>
    )
}