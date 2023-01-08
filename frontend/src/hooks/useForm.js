import { useState } from "react";
export function useForm(input) {
   const buttonDisabled = (validation) => {
      if (validation || input == null ) return true
      return false;
   }
   
   const [values, setValues] = useState(input);
   const handleChange = (e) => {
      const { value, name, validationMessage } = e.target;
      const buttonState = buttonDisabled(validationMessage);
      setValues({ ...values, [name]: value, [`${name}_error`]: validationMessage, [`${name}_buttonState`]: buttonState });
   };

   return { values, setValues, handleChange };
}