import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import {uploadImage} from "../../action/image_uploader";

export default function Quill({data, setData = false, className, register = false, render }) {
  const { quill, quillRef } = useQuill();

  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    console.log("url" + url)
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  };

  const saveToServer = async (file) => {
    await uploadImage(file)
      .then((res) => {
        console.log(res)
        insertToEditor(res);
      })
      .catch((err) => console.log(err))
  };

  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      saveToServer(file);
    };
  };


  useEffect(() => {
    if (quill) {
      if(typeof data === 'undefined') {
        data = ''
      }
      quill.clipboard.dangerouslyPasteHTML(data)
      quill.on('text-change', (delta, oldDelta, source) => {
        if(setData !== false){
          setData(quill.root.innerHTML) 
        }
        if(register !== false){
          register(quill.root.innerHTML)
        }
        // quill.getModule('toolbar').addHandler('image', selectLocalImage);

        // console.log('Text change!');
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill, render])

  return (
    <div className={`${className} bg-white`}>
      <div ref={quillRef} className="bg-white h-48 max-h-64 overflow-y-auto" />
    </div>
  );
};