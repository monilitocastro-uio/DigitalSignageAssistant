import { Field, Form } from "formik";
import styled from "styled-components";
export const SubmitButton = styled.button`
    position: absolute;
    right: 1rem;
    bottom: 1rem;
`;

export const FormikForm = styled(Form)`
    position: relative;
`;

export const FormikField = styled(Field)`
    width: 100%;
    height: 100px;
    padding: 1rem;

`;