import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import Card from "../../../components/Cards/Card";
import Layout from "../../../Layout/Layout";
import apiNews from "../../../action/news";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useQuill } from 'react-quilljs';
import instance from "../../../action/instance";
import Multiselect from 'multiselect-react-dropdown';
import Button from "../../../components/Button/button";

export default function Create(props) {
  const { quill, quillRef } = useQuill();
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [coverName, setCoverName] = useState(null)
  const [isPublish, setIsPublish] = useState()
  // const [tag, setTag] = useState()
  const [listTags, setListTags] = useState([{ name: 'Programming' }, { name: 'Design' }, { name: 'Marketing' }, , { name: 'UI/UX' }, { name: 'Education' }, { name: 'Web' }, { name: 'Android' }, , { name: 'Linux' }])
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState()
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const chooseImage = (e) => {
    setCoverName(e.target.files[0].name)
    // setImage(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  // Insert Image(selected by user) to quill
  const insertToEditor = (url) => {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  };

  const saveToServer = async (file) => {
    const body = new FormData();
    body.append('file', file);

    const res = await apiNews.imgUpload(body)
    insertToEditor(instance.pathImg + res.data.data.image);
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
      quill.on('text-change', (delta, oldDelta, source) => {
        setDescription(quill.root.innerHTML)
        quill.getModule('toolbar').addHandler('image', selectLocalImage);

        // console.log('Text change!');
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill])


  const submitNews = async (req, status) => {
    const data = new FormData()
    data.append("title", req.title)
    data.append("sub_title", req.subtitle)
    data.append("description", "hello world")
    // const tag = Array.from(tags)
    // tag.forEach((item) => {
    //   data.append("tags"+, item)
    // })
    for (let i = 0; i < tags.length; i++) {
      const tag = 'tags[' + i + ']'
      data.append(tag, tags[i].name)
    }
    if (file !== null) {
      data.append("image", file)
    }
    data.append("description", description)
    // for console log
    // for (var key of data.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }
    data.append("status", isPublish)
    await apiNews.create(data)
      .then((res) => {
        onOpenSuccessModal()
      })
      .catch((err) => setErrors(err.response.data.data))
  }

  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  const onSelectTags = (list, item) => {
    setTags(list)
  }

  const onRemoveTags = (list, item) => {
    setTags(list)
  }

  return (
    <div className="md:pt-12 md:pb-28">
      <Link href="/admin/news">
        <a className="flex gap-4 text-blue-1 my-4"><FaAngleLeft /> Back</a>
      </Link>
      <Card
        className="md:mt-4 w-full  bg-white overflow-visible"
        title="Create News" >
        <form onSubmit={handleSubmit(submitNews)}>
          {coverName === null && (
            <div className="p-8 border-dashed border-4 border-black self-center justify-center">
              <center>
                <label htmlFor="file-input">
                  <Image src="/asset/icon/ic_upload.png" alt="icon upload" htmlFor="" width={24} height={24} className="mx-auto cursor-pointer" />
                </label>
              </center>
              <p className="text-center text-blue-1">Upload Image</p>
            </div>
          )}
          {coverName !== null && (
            <div className="p-8 border-dashed border-4 border-black self-center justify-center">
              <center>
                <span>{coverName}</span> <span className="text-red-1 rounded border p-1 border-red-1 hover:cursor-pointer" onClick={() => setCoverName(null)}>x</span>
              </center>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" id="file-input" onChange={chooseImage} />
          <p className="mt-4">News Title {errors && (
            <span className="text-red-1 text-sm">{errors.sub_title}</span>
          )}</p>
          <input type="text" className="border w-full rounded p-2" placeholder="Input News Title"  {...register("title")} />
          <p className="mt-4" >Sub-Title {errors && (
            <span className="text-red-1 text-sm">{errors.sub_title}</span>
          )}</p>
          <input type="text" className="border w-full rounded p-2" placeholder="Input News Sub-Title" {...register("subtitle")} />
          <p className="mt-4">Description</p>
          <div className="w-full h-96 mb-16">
            <div ref={quillRef} />
          </div>
          <p className="mt-28 md:mt-8 ">Tags</p>
          <div className="z-10">
            <Multiselect
              className="z-100 "
              options={listTags}
              // options={listTag} // Options to display in the dropdown
              // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              onSelect={onSelectTags} // Function will trigger on select event
              onRemove={onRemoveTags} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />
          </div>
          <div className="flex -z-10 gap-4 flex-row-reverse my-4">
            <div onClick={() => setIsPublish("published")}>
              <Button title="Publish" /></div>
            <div>
              <div onClick={() => setIsPublish("draft")}>
                <button onClick={() => setIsPublish("draft")} className="border border-blue-1 hover:bg-blue-6  rounded p-2" >Save to Draft</button>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center ">
              <p> News Created Successfully </p>
              <div className="self-center">
                <Link href="/admin/news">
                  <a> <Button title="Okay" className="mt-4" /></a>
                </Link>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div >
  )
}

Create.layout = Layout