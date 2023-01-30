import Card from "../../components/Cards/Card";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import apiAccount from "../../action/account";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import instance from "../../action/instance";
import Layout from "../../Layout/Layout";
import Button from "../../components/Button/button";

export default function Profile(props) {
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()
  const { register, handleSubmit, setValue} = useForm();
  const [errors, setErrors] = useState()
  const [avatar, setAvatar] = useState('/asset/img/blank_profile.png')
  const [file, setFile] = useState()

  useEffect(async() => {
    await apiAccount.detail()
      .then((res) => {
        const data = res.data.data.user
        setValue("firstName", data.name.replace(/ .*/, ''))
        setValue("lastName", data.name.split(' ').slice(1).join(' '))
        setValue("phone", data.phone)
        setValue("email", data.email)
        setValue("gender", data.gender)
        if(res.data.data.user.avatar !== null){
          setAvatar(instance.pathImg + data.avatar)
        }
      })
  }, [])

  const onSubmit = async (req) => {
    var data = new FormData();
    data.append("name", req.firstName + " " + req.lastName)
    data.append("gender", req.gender)
    data.append("email", req.email)
    data.append("phone", req.phone)
    data.append("employee_id", req.employee_id)
    if(file){
      data.append("avatar", file)
    }
    // console.log(data)
    for (var key of data.entries()) {
      // console.log(key[0] + ', ' + key[1]);
    }

    await apiAccount.updateProfile(data)
      .then((res) => {
        onOpenSuccessModal()
      })
      .catch((err) => {
        setErrors(err.response.data.data)
      })
  }

  const choosePhoto = (e) => {
    setAvatar(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  return (
    <div className="mt-12">
        <Card
          className="w-full bg-white"
          title="Profile" >
          <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
            <div className="flex">
              <div className="m-4 relative">
                <Image className="rounded-full object-cover" loader={() => avatar} src={avatar} alt="photo profile" height={120} width={120} />
                <div className="absolute bottom-3 right-0">
                  <label htmlFor="file-input">
                    <Image src="/asset/icon/ic_edit.png" alt="icon update" width={32} height={32} className="ml-6 cursor-pointer" />
                  </label>
                </div>
              </div>
              <div className="hidden">
                <input id="file-input" type="file" className="hidden -z-50" accept="image/*" onChange={choosePhoto}/>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <p>First Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <input type="text"  className="form border w-full p-2 rounded" placeholder="Input Your First Name" {...register("firstName")} />
                </div>
                <div className="flex flex-col w-full">
                  <p>Last Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <input type="text" className="form border p-2 rounded" placeholder="Input Your Last Name" {...register("lastName")} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex flex-col w-full">
                  <p>Gender {errors && (
                    <span className="text-red-1 text-sm">{errors.gender}</span>
                  )}</p>
                  <select className="form border bg-white p-2 rounded" placeholder="Choose Gender" {...register("gender")} >
                    <option disabled>Choose Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <p>Email {errors && (
                    <span className="text-red-1 text-sm">{errors.email}</span>
                  )}</p>
                  <input type="text" className="form border p-2 rounded"  placeholder="Input Your Email" {...register("email")} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex flex-col w-full">
                  <p>Phone</p>
                  <input type="number"  className="form border p-2 rounded" placeholder="Input Your Number" {...register("phone")} />
                </div>
                <div className="flex flex-col w-full">
                  <p>Employee ID (Optional)</p>
                  <input type="number" className="form border p-2 rounded"  placeholder="Input Your Employee ID" {...register("employee_id")} />
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <Button title="Update Profil" />
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
              <p> Update Data Successfully </p>
              <div className="self-center">
                <div onClick={() => {
                  onCloseSuccessModal()
                  window.location.href = '/admin/dashboard'
                }}>  <Button title="Okay" className="mt-4" /></div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
Profile.layout = Layout