import React from "react";
import { Formik, Form, Field, ErrorMessage, useField, FieldArray } from "formik";
import * as Yup from "yup";
import "./App.css";

const MyTextInput = ({ label, ...props }) => {
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

const Answers = ({ question, name, setFieldValue }) => (
  <FieldArray
    name={name}
    render={( arrayHelpers )=> (
      <div style={{ marginTop: "8px", backgroundColor: "rgba(0,0,0,0" }}>
        {question.answers.length > 0 &&
          question.answers.map((answer, index) => (
            <div className="row answerGroup" key={index}>
             
              <div className="col">
                <label htmlFor={`${name}.${index}.header`}>Odpowiedź</label>
                <Field name={`${name}.${index}.header`} type="text" placeholder="" />
              </div>
              <div className="col">
                <label htmlFor={`${name}.${index}.teaser`}>Dodatkowe informacje odpowiedzi</label>
                <Field name={`${name}.${index}.teaser`} type="text" placeholder="" />
              </div>
              <div className="col">
                <label htmlFor={`${name}.${index}.scale`}>Punkty za odpowiedź</label>
                <Field name={`${name}.${index}.scale`} type="number" min="0" max="100" />
              </div>
              <div className="form-group">
                <label htmlFor={`${name}.${index}.file`}>Zdjęcie</label>
                <input 
                id={`${name}.${index}.file`} 
                name={`${name}.${index}.file`}  
                type="file" 
                onChange={(event) => {
                  setFieldValue(`${name}.${index}.file`, event.currentTarget.files[0]);
                  setTimeout(()=>(
                    previewFile(`${name}.${index}.file`, `${name}${index}img${index}`)), 1000)
                }} className="form-control" />
                  <img id={`${name}${index}img${index}`} src="" height="200" alt=""/>
              </div>
              
              <button
                type="button"
                onClick={() => arrayHelpers.remove(index)}
                style={{ marginTop: "8px"}}
              >
                Usuń grupę informacji dotyczących odpowiedzi
              </button>
            </div>
          ))}
      
          <button 
          type="button" 
          className="secondary"
          onClick={() => arrayHelpers.push({ 
            header: '', 
            teaser: '',
            scale: 0,
            file: null
          })}
          style={{ marginTop: "8px"}}>
            Dodaj odpowiedź
          </button>
      </div>
    )}
  />
);

// const Fileinput = ({ label, ...props }) => {
//   const [field, meta] = useField(props);
//   const fileInputs = document.querySelectorAll('input[type=file]');
//   // name={`${name}.${index}
//   return (
//     <>
//       <label htmlFor={props.id || props.name}>{label}</label>
//       <input className="text-input" {...field} {...props} />
//       {meta.touched && meta.error ? (
//         <div className="error">{meta.error}</div>
//       ) : null}
//     </>
//   );
// };

function previewFile(inputId, imgId) {
  console.log(document.getElementById(inputId).files)
  const preview = document.getElementById(imgId);
  const file = document.getElementById(inputId).files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

const QuizForm = () => {
  return (
    <>
      <h1>Dane Quizu</h1>
      <Formik
        initialValues={{
          title: "",
          teaser: "",
          file: null,
          questions: [
            {
              header: '',
              teaser: '',
              file: null,
              answers: [{
                header: '', 
                teaser: '',
                scale: 0,
                file: null
              }]
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
          {({ values, setFieldValue }) => (
        
        <Form>
          <MyTextInput
            label="Tytuł"
            name="title"
            type="text"
            placeholder=""
          />
    
          <label htmlFor="teaser">Opis</label>
          <Field 
          as="textarea" 
          label="Teaser"
          name="teaser" placeholder='' />
{/* główne zdjecie */}
          <div className="form-group">
            <label htmlFor="file">Zdjęcie główne</label>
            <input id="file" name="file" type="file" onChange={(event) => {
              setFieldValue("file", event.currentTarget.files[0]);
              setTimeout(()=>(previewFile('file', 'fileimg')), 1000)
            }} className="form-control" />
         { values.file !== null && <img id="fileimg" src="" height="200" alt=""/>}
          </div>

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

                    <div className="form-group">
                      <label htmlFor={`questions.${index}.file`}>Zdjęcie</label>
                      <input 
                      id={`questions.${index}.file`} 
                      name={`questions.${index}.file`}  
                      type="file" 
                      onChange={(event) => {
                        setFieldValue(`questions.${index}.file`, event.currentTarget.files[0]);
                        setTimeout(()=>(
                          previewFile(`questions.${index}.file`, `questions${index}img${index}`)), 1000)
                      }} className="form-control" />
                       <img id={`questions${index}img${index}`} src="" height="200" alt=""/>
                    </div>



                    <h4>Odpowiedzi</h4>
                    <Answers
                      question={question}
                      name={`questions.${index}.answers`}
                      setFieldValue={setFieldValue}
                    />

                    <div className="col">
                      <button
                        type="button"
                        className="deleteQuestionGroup"
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
                  file: null,
                  answers: [{
                    header: '', 
                    teaser: '',
                    scale: 0
                  }] 
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