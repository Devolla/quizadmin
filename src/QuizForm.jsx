import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Formik, Form, Field, ErrorMessage, useField, useFormikContext, FieldArray } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import "./App.css";
// import "./styles-custom.css";

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

// const MyCheckbox = ({ children, ...props }) => {
//   const [field, meta] = useField({ ...props, type: "checkbox" });
//   return (
//     <>
//       <label className="checkbox">
//         <input {...field} {...props} type="checkbox" />
//         {children}
//       </label>
//       {meta.touched && meta.error ? (
//         <div className="error">{meta.error}</div>
//       ) : null}
//     </>
//   );
// };

// Styled components ....
const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
// const MySelect = ({ label, ...props }) => {
//   const [field, meta] = useField(props);
//   return (
//     <>
//       <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
//       <StyledSelect {...field} {...props} />
//       {meta.touched && meta.error ? (
//         <StyledErrorMessage>{meta.error}</StyledErrorMessage>
//       ) : null}
//     </>
//   );
// };



const Answers = ({ question, name }) => (
  <FieldArray
    name={name}
    render={arrayHelpers => (
      <div style={{ marginTop: "8px", backgroundColor: "rgba(0,0,0,0" }}>
        {question.answers.length > 0 &&
          question.answers.map((answer, index) => (
            <div key={index}>
              <Field name={`${name}.${index}`} />
              <button
                type="button"
                onClick={() => arrayHelpers.remove(index)}
              >
                Usuń odpowiedź
              </button>
            </div>
          ))}
      
          <button type="button" onClick={() => arrayHelpers.push("")}>
            Dodaj odpowiedź
          </button>
      </div>
    )}
  />
);

// And now we can use these
const QuizForm = () => {
  return (
    <>
      <h1>Dane Quizu</h1>
      <Formik
        initialValues={{
          title: "",
          teaser: "",
          questions: [
            {
              header: '',
              teaser: '',
              answers: []
            },
          ],
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "Maksymalnie 30 znaków")
            .required("Required"),
            teaser: Yup.string()
            .max(200, "Maksymalnie 200 znaków")
            .required("Required"),
        })}
        // onSubmit={async (values, { setSubmitting }) => {
        //   await new Promise(r => setTimeout(r, 500));
        //   setSubmitting(false);
        // }}
        onSubmit={values => {
          alert(JSON.stringify(values, null, 2));
          console.log(values, 'values')
        }}
      >
          {({ values }) => (
        
        <Form>
          <MyTextInput
            label="Tytuł"
            name="title"
            type="text"
            placeholder=""
          />
          {/* <MyTextInput
            label="Teaser"
            name="teaser"
            type="text"
            placeholder=""
          /> */}
          <label htmlFor="teaser">Opis</label>
          <Field 
          as="textarea" 
          label="Teaser"
          name="teaser" placeholder='' />

        <h3>Pytania</h3>
        <FieldArray name="questions">
          {({ insert, remove, push }) => (
            <div>
              {values.questions.length > 0 &&
                values.questions.map((question, index) => (
                  <div className="row questionGroup" key={index}>
                    <div className="col">
                      <label htmlFor={`questions.${index}.header`}>Pytanie</label>
                      <Field
                        name={`questions.${index}.header`}
                        placeholder=""
                        type="text"
                      />
                      <ErrorMessage
                        name={`questions.${index}.header`}
                        component="div"
                        className="field-error"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor={`questions.${index}.teaser`}>Dodatkowe informacje pytania</label>
                      <Field
                        name={`questions.${index}.teaser`}
                        placeholder=""
                        type="text"
                      />
                      <ErrorMessage
                        name={`questions.${index}.teaser`}
                        component="div"
                        className="field-error"
                      />
                    </div>
                    <Answers
                      question={question}
                      name={`questions.${index}.answers`}
                    />

                    <div className="col">
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => remove(index)}
                      >
                        Usuń pytanie i odpowiedzi
                      </button>
                    </div>
                  </div>
                ))}
              <button
                type="button"
                className="secondary dynamic"
                onClick={() => push({ 
                  header: '', 
                  teaser: '',
                  answers: [] 
                })}
              >
              Dodaj pytanie
              </button>
            </div>
          )}
        </FieldArray>
          <button type="submit">Submit</button>
        </Form>
          )}
      </Formik>
    </>
  );
};

export default QuizForm;