import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";
import { useForm } from "../hooks/useForm";

export function AddPlacePopup({ isOpen, onClose, onAddPlace, buttonText }) {

const {values, handleChange, setValues} = useForm({name: '', link: ''})

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace(
            values
        );
    }

    useEffect(() => {
        setValues({name: '', link: ''})
    }, [isOpen]);

    return (
        <PopupWithForm
            title="Новое место"
            name="add-picture"
            buttonTitle={buttonText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            setButtonState = {values.name_buttonState || values.link_buttonState } >
            <input
                className="popup__input popup__input_field_place-name"
                type="text"
                value={values.name}
                onChange={handleChange}
                name='name'
                id="place-name-input"
                required
                placeholder="Название"
                minLength="2"
                maxLength="30" />
            <span className="input-error">{values.name=='' ? null : values.name_error}</span>
            <input
                className="popup__input popup__input_field_place-link"
                type="url"
                name='link'
                onChange={handleChange}
                value={values.link}
                id="place-link-input"
                required
                placeholder="Ссылка на картинку" />
            <span className="input-error">{values.link=='' ? null : values.link_error}</span>
        </PopupWithForm>
    )
}