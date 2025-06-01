import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor=({input,setInput})=> {
  const [value, setValue] = useState('');
  const onChangeHandler=(content)=>{
    setInput({...input,description:content});
  }

  return <ReactQuill theme="snow" className='dark:bg-black  ' value={input.description} onChange={onChangeHandler} />;
}
export default RichTextEditor