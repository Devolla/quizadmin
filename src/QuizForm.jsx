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
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Persist } from 'formik-persist';
// import { forEach } from "lodash";

function prepareImgObjToSend(file, imgSrc) {
  const fileObject = file;
   const newObject  = {
    'lastModified'     : fileObject.lastModified,
    'lastModifiedDate' : fileObject.lastModifiedDate,
    'name'             : fileObject.name,
    'size'             : fileObject.size,
    'type'             : fileObject.type,
    'src'              : imgSrc
 };  
 return newObject;
}

const allFormValues = JSON.parse(window.localStorage.getItem('signup-form'));
// console.log(allFormValues, 'allFormValues')


const TextEditor = ({ value, setFieldValue }) => {
  // console.log(setFieldValue)
  const prepareDraft = (value) => {
    const draft = htmlToDraft(value);
    const contentState = ContentState.createFromBlockArray(draft.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  };

  let editorValue = allFormValues === null ? "" : allFormValues.values.txteditor;
  const [editorState, setEditorState] = useState(
    value ? prepareDraft(value) : prepareDraft(editorValue)
    // value ? prepareDraft(value) : EditorState.createEmpty()
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
        // toolbar={{
        //   options: [
        //     "inline",
        //     "blockType",
        //     // "fontSize",
        //     "fontFamily",
        //     "list",
        //     "textAlign",
        //     "colorPicker",
        //     "remove",
        //     "history",
        //   ],
        // }}
      />
    </div>
  );
};
  
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

const Answers = ({ question, name, setFieldValue, name1, nameNb, name2 }) => (
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
                  // const newObject = prepareImgObjToSend(event.currentTarget.files[0]);
                  // setFieldValue(`${name}.${index}.photo`, newObject);
                  // setTimeout(()=>(previewPhoto(`${name}.${index}.photo`, `${name}${index}img${index}`)), 1000);
                  setTimeout(()=>(previewPhoto(`${name}.${index}.photo`, `${name}${index}img${index}`)), 1000);
                  const img = document.getElementById(`${name}${index}img${index}`);
                  const imgSrc = img.src;
                  const newObject = prepareImgObjToSend(event.currentTarget.files[0], imgSrc);
                  setFieldValue(`${name}.${index}.photo`, newObject);
                  setTimeout(()=>imgUpdate(name, index), 1100)
                  function imgUpdate(name, index) {
                    // console.log(name, index, 'name index w settime')
                    const img = document.getElementById(`${name}${index}img${index}`);
                    const imgSrc = img.src;
                    newObject.src = imgSrc;
                    setFieldValue(`${name}.${index}.photo`, newObject);
                  }
                }} 
                // onLoad={()=> allFormValues === null ? console.log('dupa') : previewPhoto(allFormValues.values.name.index.photo, `${name}${index}img${index}`)}
                 
                className="form-control" />
                  {/* { name.index.photo !== null &&  */}
                  <img
                  className="formImg"
                  data-path={`${name}.${index}.photo`}
                   id={`${name}${index}img${index}`} 
                   style={{ marginTop: "30px", marginBottom:"15px", display:"block", maxHeight:"200px"}} 
                   src={(allFormValues.values[name1][nameNb] !== undefined && allFormValues.values[name1][nameNb][name2].index !== undefined) ?  allFormValues.values[name1][nameNb][name2][index].photo.src : ''} 
                   height="" alt=""/>
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
  const photo = document.getElementById(inputId).files[0];
  console.log(photo, 'files z prewiew')
  const preview = document.getElementById(imgId);
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
          console.log(JSON.stringify(values), 'values')
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
          name="txteditor"
          setFieldValue={(val) => {setFieldValue("txteditor", val)}}
          // value={values.txteditor}
        />

{/* główne zdjecie */}
          <div className="form-group">
            <label htmlFor="photo">Zdjęcie główne</label>
            <input id="photo" name="photo" type="file" 
            onChange={(event) => {
              setTimeout(()=>(previewPhoto('photo', 'photoimg')), 1000);
              const img = document.getElementById('photoimg');
              const imgSrc = img.src;
              const newObject = prepareImgObjToSend(event.currentTarget.files[0], imgSrc);
              setFieldValue("photo", newObject);
              setTimeout(imgUpdate, 1100)
              function imgUpdate() {
                const img = document.getElementById('photoimg');
                const imgSrc = img.src;
                newObject.src = imgSrc;
                setFieldValue("photo", newObject);
              }
            }} 
            className="form-control" 
            />
         { values.photo !== null && <img 
          className="formImg"
         id="photoimg" 
          //  onLoad={allFormValues === null ? console.log('dupa') : previewPhoto(allFormValues.values['photo'], 'photoimg')} 
           src={allFormValues === null ? '' : allFormValues.values['photo'].src } 
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
                      <label htmlFor={`questions.${index}.photo`}>Zdjęcie do pytania</label>
                      <input 
                      id={`questions.${index}.photo`} 
                      name={`questions.${index}.photo`}  
                      type="file" 
                      onChange={(event) => {
                        // const newObject = prepareImgObjToSend(event.currentTarget.files[0], `questions${index}img${index}`, `questions.${index}.photo`);
                        // setFieldValue(`questions.${index}.photo`, newObject);
                        // setTimeout(()=>(previewPhoto(`questions.${index}.photo`, `questions${index}img${index}`)), 1000)

                  setTimeout(()=>(previewPhoto(`questions.${index}.photo`, `questions${index}img${index}`)), 1000)
                  const img = document.getElementById(`questions${index}img${index}`);
                  const imgSrc = img.src;
                  const newObject = prepareImgObjToSend(event.currentTarget.files[0], imgSrc);
                  setFieldValue(`questions.${index}.photo`, newObject);
                  setTimeout(()=>imgUpdate(index), 1100)
                  function imgUpdate(index) {
                    const img = document.getElementById(`questions${index}img${index}`);
                    const imgSrc = img.src;
                    newObject.src = imgSrc;
                    setFieldValue(`questions.${index}.photo`, newObject);
                  }
                      }} 
                      className="form-control" />
                        {/* { values.questions.index.photo !== null &&  */}
                       <img 
                        className="formImg"
                        data-path={`questions.${index}.photo`}
                       id={`questions${index}img${index}`} 
                      //  src={(allFormValues.values['questions'] !== undefined && allFormValues.values['questions'][index] !== undefined && allFormValues.values['questions'][index].photo.src === null ) ? allFormValues.values['questions'][index].photo.src : ''} 
                       height=""
                       style={{ maxHeight:"200px", marginTop: "30px", marginBottom:"15px", display:"block"}} 
                       alt=""/>
                       {/* } */}
                    </div>



                    <h4>Odpowiedzi</h4>
                    <Answers
                      question={question}
                      name={`questions.${index}.answers`}
                      name1={'questions'}
                      nameNb={`${index}`}
                      name2={'answers'}
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
          <Persist name="signup-form" />
        </Form>
          )}
      </Formik>
    </>
  );
};

export default QuizForm;