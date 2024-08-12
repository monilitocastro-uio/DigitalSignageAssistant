import React from 'react';
import { Formik, Form, Field } from 'formik';
import { FormikField, FormikForm, SubmitButton } from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { logger } from '../../services/logger';
import axios from 'axios';

export const ChatForm = () => {
    const handleKeyDown = (ev, handleSubmit) => {
        if(ev.key==='Enter' && !ev.shiftKey){
            ev.preventDefault();
            handleSubmit();
        }
    }
  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={ async (values, { resetForm }) => {
        // Handle form submission

        try{
            var response = await axios.post("/chat",message)
            var data = response.data;
        }catch(ex){
            logger(ex);
        }

        // Reset the form fields
        resetForm();
      }}
    >
      {({ handleChange, handleBlur, values, handleSubmit }) => (
        <FormikForm>
          <FormikField
            as="textarea"
            name="message"
            placeholder="Type your message here..."
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.message} 
            onKeyDown={ev=>handleKeyDown(ev, handleSubmit)}
          />
          <SubmitButton type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Submit
          </SubmitButton>
        </FormikForm>
      )}
    </Formik>
  );
};
 
