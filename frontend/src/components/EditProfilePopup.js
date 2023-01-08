import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";
import { useForm } from "../hooks/useForm";

export function EditProfilePopup({ isOpen, onClose, onUpdateUser, buttonText }) {

    const {values, handleChange, setValues} = useForm({name: '', role: ''})
  
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setValues({name: currentUser.name, role: currentUser.about});
    }, [ isOpen]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name: values.name,
            about: values.role,
        });
    }


    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="edit-profile"
            buttonTitle={buttonText}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            setButtonState={values.name_buttonState || values.role_buttonState} >
            <input className="popup__input popup__input_field_name"
                onChange={handleChange}
                value={values.name || ""}
                type="text"
                name="name"
                id="name-input"
                required
                placeholder="Ваше имя"
                minLength="2"
                maxLength="40"
                 />
            <span className="input-error">{values.name=='' ? null : values.name_error}</span>
            <input className="popup__input popup__input_field_role"
                onChange={handleChange}
                value={values.role || ""}
                type="text"
                name="role"
                id="role-input"
                required
                placeholder="Напишите о себе"
                minLength="2"
                maxLength="200" />
            <span className="input-error">{values.role ? null : values.role_error}</span></PopupWithForm>
    )
}