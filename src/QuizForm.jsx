import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useField, FieldArray } from "formik";
import * as Yup from "yup";
import "./App.css";
// import {
//   HtmlEditor,
//   Image,
//   Inject,
//   Link,
//   QuickToolbar,
//   RichTextEditorComponent,
//   Toolbar
// } from "@syncfusion/ej2-react-richtexteditor";

// import { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, ContentState, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";



const TextEditor = ({ value, setFieldValue }) => {
  console.log(value)
  const prepareDraft = (value) => {
    const draft = htmlToDraft(value);
    const contentState = ContentState.createFromBlockArray(draft.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  };

  const [editorState, setEditorState] = useState(
    value ? prepareDraft(value) : EditorState.createEmpty()
  );

  const onEditorStateChange = (editorState) => {
    const forFormik = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setFieldValue(forFormik);
    setEditorState(editorState);
  };
  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="custom-wrapper"
        editorClassName="custom-editor"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
};

TextEditor.defaultProps = {
  value: "dupa"
}
  





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
              <div className="col form-group">
                <label htmlFor={`${name}.${index}.photo`}>Zdjęcie</label>
                <input 
                id={`${name}.${index}.photo`} 
                name={`${name}.${index}.photo`}  
                type="file" 
                onChange={(event) => {
                  setFieldValue(`${name}.${index}.photo`, event.currentTarget.files[0]);
                  setTimeout(()=>(
                    previewPhoto(`${name}.${index}.photo`, `${name}${index}img${index}`)), 1000)
                }} 
                className="form-control" />
                  {/* { name.index.photo !== null &&  */}
                  <img id={`${name}${index}img${index}`} 
                   style={{ marginTop: "30px", marginBottom:"15px", display:"block", maxHeight:"200px"}} 
                  src="" height="" alt=""/>
                  {/* } */}
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={() => arrayHelpers.remove(index)}
                  style={{ marginTop: "25px", marginBottom:"20px"}}
                >
                  Usuń grupę informacji dotyczących odpowiedzi
                </button>
              </div>
            </div>
          ))}
      
          <button 
          type="button" 
          className="secondary"
          onClick={() => arrayHelpers.push({ 
            header: '', 
            teaser: '',
            scale: 0,
            photo: null
          })}
          // style={{ marginTop: "8px"}}
          >
            Dodaj odpowiedź
          </button>
      </div>
    )}
  />
);

function previewPhoto(inputId, imgId) {
  console.log(inputId, imgId)
  const preview = document.getElementById(imgId);
  const photo = document.getElementById(inputId).files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    preview.src = reader.result;
  }, false);

  if (photo) {
    reader.readAsDataURL(photo);
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

const QuizForm = () => {
  return (
    <>
      <h1>Dane Quizu</h1>
      <Formik
        initialValues={{
          title: '',
          teaser: '',
          photo: null,
          calendar:  {
            start_time: '',
            end_time: '',
          },
          txteditor: '',
          questions: [
            {
              header: '',
              teaser: '',
              bodytext: '',
              photo: null,
              answers: [{
                header: '', 
                teaser: '',
                scale: 0,
                photo: null
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
          // console.log(rteObj)
          // values.txteditor = rteObj.value;
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

         

          {/* description texteditor */}
          <label htmlFor="txteditor">Opis w text editor</label>
          {/* <Field name="txteditor" component={renderRTEField} label="txteditor" /> */}
          <TextEditor
          setFieldValue={(val) => setFieldValue("txteditor", val)}
          value={values.txteditor}
        />

{/* główne zdjecie */}
          <div className="form-group">
            <label htmlFor="photo">Zdjęcie główne</label>
            <input id="photo" name="photo" type="file" onChange={(event) => {
              setFieldValue("photo", event.currentTarget.files[0]);
              setTimeout(()=>(previewPhoto('photo', 'photoimg')), 1000)
            }} className="form-control" />
         { values.photo !== null && <img id="photoimg" src="" 
         height="200" 
         style={{ marginTop: "30px", marginBottom:"30px", display:"block"}} 
         alt=""/>}
          </div>

          {/* calendar */}
          <label htmlFor="calendar.start_time">Start quizu</label>
          <Field 
          type="datetime-local"
          label="Start quizu"
          // min="2023-01-01T00:00" max="2023-04-30T00:00"
          name="calendar.start_time" 
          // required 
          // pattern="\d{4}-\d{2}-\d{2}"
           />
          <label htmlFor="calendar.end_time">Koniec Quizu</label>
          <Field 
           type="datetime-local"
           label="Koniec quizu"
           // min="2023-01-01T00:00" max="2023-04-30T00:00"
           name="calendar.end_time" 
          //  required 
          //  pattern="\d{4}-\d{2}-\d{2}"
            />

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

                    <div className="col">
                    <label htmlFor={`questions.${index}.bodytext`}>Opis</label>
                    <Field 
                    as="textarea" 
                    label={`questions.${index}.bodytext`}
                    name={`questions.${index}.bodytext`} placeholder='' />
                    </div>

                    <div className="form-group col">
                      <label htmlFor={`questions.${index}.photo`}>Zdjęcie</label>
                      <input 
                      id={`questions.${index}.photo`} 
                      name={`questions.${index}.photo`}  
                      type="file" 
                      onChange={(event) => {
                        setFieldValue(`questions.${index}.photo`, event.currentTarget.files[0]);
                        setTimeout(()=>(
                          previewPhoto(`questions.${index}.photo`, `questions${index}img${index}`)), 1000)
                      }} className="form-control" />
                        {/* { values.questions.index.photo !== null &&  */}
                       <img id={`questions${index}img${index}`} 
                       src="" height=""
                       style={{ maxHeight:"200px", marginTop: "30px", marginBottom:"15px", display:"block"}} 
                       alt=""/>
                       {/* } */}
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
                  bodytext:'',
                  photo: null,
                  answers: [{
                    header: '', 
                    teaser: '',
                    scale: 0,
                    photo: null
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