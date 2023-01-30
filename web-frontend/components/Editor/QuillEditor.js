import $ from "jquery";
import katex from "katex";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import {uploadImage} from "../../action/image_uploader";

if (typeof window !== "undefined") {
  window.katex = katex;
  window.jQuery = window.$ = $;
  const mathquill4quill = require("mathquill4quill");
  require("mathquill/build/mathquill.js");
}

class QuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.reactQuill = React.createRef();
    this.state = {
      defaultData : this.props.data
    }
    // this.editorRef = React.useRef()
    // this.attachQuillRefs = this.attachQuillRefs.bind(this);
  }

  componentDidMount() {
    this.setState({
      defaultData: this.props.data
    })
    const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });
    enableMathQuillFormulaAuthoring(this.reactQuill.current.editor, this.props.options);
    // this.reactQuill.current.clipboard.dangerouslyPasteHTML(data)
  }

  // componentDidUpdate(){
  //   this.setState({
  //     defaultData: this.props.data
  //   })
  // }

  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const  container =  $(this.quill.container).parent().parent();
      // Save current cursor state
      const range = this.quill.getSelection(true);
      // Insert temporary loading placeholder image
      this.quill.insertEmbed(range.index, 'image', `${window.location.origin}/asset/img/loaders/loader.gif`);
      // Move cursor to right side of image (easier to continue typing)
      this.quill.setSelection(range.index + 1);
      const editor = this;
     await uploadImage(file, container.data("type"), container.data("subType")).then(function (res){
        // Remove placeholder image
        editor.quill.deleteText(range.index, 1);
        // Insert uploaded image
        editor.quill.insertEmbed(range.index, 'image', res);
      });
    };
  }

  render() {
    return (
      <ReactQuill
        ref={this.reactQuill}
        modules={{
          formula: true,
          // toolbar: toolbarOptions
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
              // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              // [{ 'direction': 'rtl' }],                         // text direction

              // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['formula'],
              ["link", "image", "video"],
              ['clean']                                         // remove formatting button
            ],
            handlers: {
              image: this.imageHandler,
              // link: function (value) {
              //   if (value) {
              //     var href = prompt('Enter the URL');
              //     this.quill.format('link', href);
              //   } else {
              //     this.quill.format('link', false);
              //   }
              // }
            }
          }
        }}
        defaultValue={this.state.defaultData}
        theme={"snow"}
        placeholder={"Write ..."}
        bounds={".quill"}
        onChange={(e) => this.props.setText(e)}
      />
    );
  }
}

export default QuillEditor;
