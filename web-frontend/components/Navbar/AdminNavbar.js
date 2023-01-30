import React from "react";
import Link from 'next/link'
import Image from "next/image";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import instance from "../../action/instance.js";
import apiAccount from "../../action/account.js";
import { useEffect, useState } from "react";
import { store } from './../../redux/store'
import role from "../../redux/role";
import { FiMenu } from "react-icons/fi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useRouter } from "next/router";
import Multiselect from "multiselect-react-dropdown";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import Button from "../Button/button.js";
import { useDispatch } from "react-redux";
import { reSetCurrentUser } from "../../action/auth/authAction";
import apiStudentPage from '../../action/student_page'
import { FaAngleLeft } from "react-icons/fa";
import { admin, instituteAdmin, staff, operator, student } from "./Menu.js";
import { ModalExitTest } from "../Modal/ModalExitTest.js";
import { FiChevronDown } from 'react-icons/fi'
import { region } from './../../action/India'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { useRef } from "react";

export default function AdminNavbar({ isTest = false }) {
  const searchInput = useRef();
  const [avatar, setAvatar] = useState('/asset/img/blank_profile.png')
  const [username, setUsername] = useState()
  const roleStore = store.getState().auth.user.user.roles[0].name
  const [activeSidebar, setActiveSidebar] = useState(false)
  const router = useRouter();
  const [listInstituteBatch, setListInstituteBatch] = useState([])
  const Router = useRouter()
  const [linkExit, setLinkExit] = useState()
  const [search, setSearch] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState([])
  const [city, setCity] = useState('')
  const dispatch = useDispatch()
  const [openProfile, setOpenProfile] = useState(false)
  const [listInstitute, setListInstitute] = useState([])
  const [instituteSelect, setInstituteSelect] = useState({})
  const [isBatch, setIsBatch] = useState(false)
  const [acceptInstitute, setAcceptInstitute] = useState({
    approve: false
  })
  const [isJoined, setIsJoined] = useState(true)
  const [renderistInstitute, setRenderListInstitute] = useState(false)
  const [batchSelect, setBatchSelect] = useState([])
  const {
    isOpen: isExitModal,
    onOpen: onOpenExitModal,
    onClose: onCloseExitModal
  } = useDisclosure()
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const [itemList, setItemList] = useState([])
  useEffect(() => {
    if (roleStore === role.admin)
      setItemList(admin)
    if (roleStore === role.instituteAdmin)
      setItemList(instituteAdmin)
    if (roleStore === role.operator)
      setItemList(operator)
    if (roleStore === role.staff)
      setItemList(staff)
    if (roleStore === role.student)
      setItemList(student)
  }, [])

  useEffect(async () => {
    await apiAccount.detail()
      .then((res) => {
        setUsername(res.data.data.user.name)
        if (res.data.data.user.avatar !== null) {
          setAvatar(instance.pathImg + res.data.data.user.avatar)
        }
      })
  }, [])

  useEffect(() => {
    const getBatch = async () => {
      if (roleStore === role.student) {
        if (!isJoined) {
          // console.log(instituteSelect)
          await apiStudentPage.listInstituteBatch(instituteSelect.institute_id, instituteSelect.id)
            .then((res) => {
              setListInstituteBatch(res.data.data)
            })
        }
      }
    }
    getBatch()
  }, [instituteSelect, isJoined])

  const handleChange = (...args) => {
    // searchInput.current.querySelector("input").value = "";
    // console.log("ARGS:", args[0]);
    setCity(args[0])
    // console.log("CHANGE:");
  };

  const handleFilter = (items) => {
    // console.log(items)
    return (searchValue) => {
      if (searchValue.length === 0) {
        return cities;
      }
      // const updatedItems = items.map((list) => {
      //   console.log(list)
        const newItems = items.filter((item) => {
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        // return { ...items, newItems };
      // });
      // console.log(updatedItems)
      return newItems
    };
  };

  useEffect(() => {
    const checkInstitute = async () => {
      if (roleStore === role.student) {
        await apiStudentPage.checkInstitute()
          .then((res) => {
            if (res.data.data.approve) {
              setIsJoined(true)
            }
            setAcceptInstitute(res.data.data)
          })
      }
    }
    checkInstitute()
  }, [])

  useEffect(() => {
    if (roleStore === role.student) {
      let listCity = []
      let tempRegion = region
      tempRegion.map((item) => {
        item.type = 'group'
        item.cities.map((itemCity) => {
          itemCity.value = itemCity.name
          listCity.push(itemCity)
        })
      })
      setCities(listCity)
    }
  }, [renderistInstitute])

  const onSelectTopic = (list, item) => {
    setSelectedCity(item)
  }

  const onRemoveTopic = (list, item) => {
    setSelectedCity('')
  }


  useEffect(() => {
    const getInstitute = async () => {
      if (roleStore === role.student) {
        await apiStudentPage.listInstitute(search, city)
          .then((res) => {
            setListInstitute(res.data.data)
          })
      }
    }
    getInstitute()
  }, [renderistInstitute, city, search])

  const joinInstitute = async () => {
    console.log(instituteSelect)
    const data = {
      institute_id: instituteSelect.institute_id,
      branch_id: instituteSelect.id,
      batch_id: batchSelect.id
    }
    if (roleStore === role.student) {
      await apiStudentPage.joinInstitute(data)
        .then((res) => {
          onCloseCreateModal()
        })
    }
  }

  return (
    <>
      <div className="flex bg-blue-1 md:px-12 py-2 gap-8 justify-between fixed w-full top-0 z-50 ">
        <div className="flex">
          <div className="md:hidden my-auto mx-2" onClick={() => {
            setActiveSidebar(!activeSidebar)
            setOpenProfile(!openProfile)
          }}>
            <FiMenu color="white" />
          </div>
          <h1 className="text-white text-2xl md:mx-4 my-auto cursor-pointer">
            {isTest ? (
              <div onClick={() => {
                onOpenExitModal()
                setLinkExit('/student/home')
              }}>Examz</div>
            ) : (
              <Link href="/"><a> Examz</a></Link>
            )}
          </h1>
        </div>
        <div className="flex  gap-4 justify-center my-auto">
          {roleStore === role.student && (
            <>
              <div className={`${acceptInstitute.approve && 'hidden'} flex bg-white text-blue-1 px-2 hover:bg-black-7 rounded`}>
                <button className="my-auto" onClick={() => {
                  setRenderListInstitute(!renderistInstitute)
                  setCity('')
                  setSearch('')
                  setIsBatch(false)
                  onOpenCreateModal()
                }}>
                  Join Institute
                </button>
              </div>
              <div className={`${!acceptInstitute.approve && 'hidden'} flex gap-2 text-white px-2 rounded`}>
                <Image src="/asset/icon/sidebar/ic_college.svg" height="32" width="32" alt="icon campus" />
                <div className="my-auto">
                  {acceptInstitute.enrollement?.institute?.name}
                </div>
              </div>
              <div className={`flex mr-4  md:mr-0  `}>
                {isTest ? (
                  <div className="my-auto inline-flex cursor-pointer" onClick={() => {
                    onOpenExitModal()
                    setLinkExit('/student/notification')
                  }}><Image src="/asset/icon/sidebar/ic_notification.svg" className=" rounded-full object-cover" height={32} width={32} alt="icon notification" /></div>
                ) : (
                  <div className="my-auto inline-flex cursor-pointer" onClick={() => { window.location.href = "/student/notification" }}>
                    <Image src="/asset/icon/sidebar/ic_notification.svg" className=" rounded-full object-cover" height={32} width={32} alt="icon notification" />
                  </div>
                )}
              </div>
              {/* <div className="flex mr-4 md:mr-0 bg-yellow-700 ">
                <div className="">
                  <div className="my-auto inline-flex ">
                    <Link href="/student/notification">
                      <a>
                        <Image src="/asset/icon/sidebar/ic_notification.svg" className="rounded-full my-auto  align-middle  object-cover" height={32} width={32} alt="avatar" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div> */}
            </>
          )}
          {/* <div className={`flex `}> */}
          <div className={`md:flex ${roleStore === role.student && 'hidden'} flex `}>
            <div className="my-auto inline-flex">
              <Image loader={() => avatar} src={avatar} className=" rounded-full object-cover" height={32} width={32} alt="avatar" />
            </div>
            {isTest ? (
              <div className="my-auto inline-flex cursor-pointer" onClick={() => {
                onOpenExitModal()
                setLinkExit('/account/profile')
              }}><div className="items-center flex md:space-x-5 space-x-1 text-white py-2 text-east-bay-500">
                  <span className="md:ml-4 ml-1 ">{username || ''}</span>
                  <div>
                    <FiChevronDown size={16} className="mr-4" />
                  </div>
                </div></div>
            ) : (
              <UserDropdown username={username} isTest={isTest} />
            )}
          </div>
        </div>
      </div >

      <div className={`py-16 bg-white fixed z-40 h-screen ${activeSidebar ? '' : 'hidden'}`}>
        {roleStore === role.instituteAdmin && (
          <div className="bg-black-9 m-2 rounded-lg p-2 flex gap-4 mb-2">
            <Image src="/asset/icon/sidebar/ic_college.svg" height="32" width="32" alt="icon campus" />
            <span className="text-black-1 m-auto">Hardvard Campus</span>
          </div>
        )}
        {roleStore === role.staff && (
          <div className="bg-black-9 m-2 rounded-lg p-2 flex gap-4 mb-2">
            <Image src="/asset/icon/sidebar/ic_college.svg" height="32" width="32" alt="icon campus" />
            <span className="text-black-1 m-auto">Hardvard Campus</span>
          </div>
        )}
        <ul className="px-4 inline-block w-60 lg:inline-block">
          {itemList.map((item, index) => {
            const isActive = router.pathname.indexOf(item.path) !== -1
            return (
              <li key={index} className={` ${isActive ? 'bg-blue-1 text-white shadow-lg' : 'bg-white'} flex px-2 gap-4 mt-1 rounded-lg  inline-block block py-2 text-black-3 `} onClick={() => setActiveSidebar(!activeSidebar)}>
                <Link href={item.path}>
                  <a className="flex gap-4 inline-block cursor-pointer p-1 rounded">
                    {isActive ? (
                      <img src={item.active} alt={item.name} className=" w-4 h-4" />
                    ) : (
                      <img src={item.icon} alt={item.name} className=" w-4 h-4" />
                    )}
                    <span className="text-sm"> {item.name}</span>
                  </a>
                </Link>
              </li>
            )
          })}
          <div className={`md:hidden ${roleStore !== role.student && 'hidden'} flex gap-2 mt-4 justify-between `} onClick={() => setOpenProfile(!openProfile)}>
            <div className="flex gap-2">
              <div className="my-auto inline-flex">
                <Image loader={() => avatar} src={avatar} className=" rounded-full object-cover" height={32} width={32} alt="avatar" />
              </div>
              <div className="my-auto">
                {username}
              </div>

            </div>

            <div className="my-auto right-0">
              {openProfile ? <BsChevronDown /> : <BsChevronUp />}
            </div>
          </div>
          {openProfile && (
            <>
              <section
                className={`${roleStore !== role.student && 'hidden'} bg-white  mr-4 text-base z-50 right-0 pl-10 py-2 list-none rounded md:hidden   min-w-48 flex flex-col p-4 gap-1 `}
              // (open ? " translate-x-0 " : " translate-x-full ")
              // }
              >
                <Link href='/account/profile' >
                  <a onClick={() => {
                    setActiveSidebar(false)
                  }}>
                    <button className="text-left font-medium" >Edit Profile</button>
                  </a>
                </Link>
                <Link href='/account/password'>
                  <a onClick={() => {
                    setActiveSidebar(false)
                  }}>
                    <button className="font-medium">Change Password</button>
                  </a>
                </Link>
                <button
                  className={
                    "font-medium block w-full whitespace-nowrap bg-transparent text-red-1 text-left"
                  }
                  onClick={(e) => {
                    if (window !== undefined) {
                      dispatch(reSetCurrentUser({}));
                      localStorage.removeItem('ACCESS_TOKEN')
                      Router.replace('/')
                    }
                  }}
                >
                  Logout
                </button>
              </section>
              <section
                className=" w-screen h-full cursor-pointer "
                onClick={() => {
                  setOpen(false);
                }}
              ></section>
            </>
          )}
        </ul>
      </div>

      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='lg'
        motionPreset='slideInBottom' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md"><center>{isBatch ? 'Select Batch' : 'Join Institute'}</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex px-2">
              <input type="text" className="form border mb-4 w-full p-2 text-sm rounded" placeholder="Search Institute" onChange={(e) => setSearch(e.target.value)} />
              <div className="flex  w-full">
                {/* <SelectSearch
                  ref={searchInput}
                  options={cities}
                  filterOptions={handleFilter}
                  value="name"
                  name="Workshop"
                  placeholder="Select City"
                  search
                  onChange={handleChange}
                /> */}
              </div>

            </div>
            <div className="flex flex-wrap">
              {isBatch ? (
                <>
                  {listInstituteBatch.map((item, index) => (
                    <div key={index} className={`flex flex-wrap gap-4my-2 w-1/2 p-2 text-sm cursor-pointer`} onClick={() => setBatchSelect(item)}>
                      <div className={`${item === batchSelect ? 'bg-blue-6 border border-blue-1' : 'bg-white'}  flex  border rounded  w-full p-2 gap-2`}>
                        <img className="w-8 h-8 my-auto" src="/asset/icon/table/ic_school_orange.svg" />
                        <div>
                          <h1 className="font-bold">{item.name}</h1>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {listInstitute.map((item, index) => (
                    <div key={index} className={`flex flex-wrap gap-4my-2 w-1/2 p-2 text-sm cursor-pointer`} onClick={() => setInstituteSelect(item)}>
                      <div className={`${item === instituteSelect ? 'bg-blue-6 border border-blue-1' : 'bg-white'}  flex  border rounded  w-full p-2 gap-2`}>
                        <img className="w-8 h-8 my-auto" src="/asset/icon/table/ic_school_orange.svg" />
                        <div>
                          <h1 className="font-bold">{item.institute.name}</h1>
                          <p>{item.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {isBatch && (
              <div className="flex gap-2 text-blue-1 cursor-pointer" onClick={() => setIsBatch(false)}>
                <div className="flex my-auto">
                  <FaAngleLeft color="blue" />
                </div>Back To List Institute
              </div>
            )}
            <div className="flex flex-row-reverse gap-4 mt-4 py-2">
              {isBatch ? (
                <div onClick={() => {
                  joinInstitute()
                }}>
                  <Button title="Join Batch Institute" />
                </div>
              ) : (
                <div onClick={() => {
                  setIsJoined(false)
                  setIsBatch(true)
                }}>
                  <Button title="Select Institute" />
                </div>)}
              <button type="button" className="text-black-4 px-2 hover:bg-blue-6 rounded border-blue-1" onClick={() => {
                setIsBatch(false)
                onCloseCreateModal()
              }}>Cancel</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalExitTest isOpen={isExitModal} onClose={onCloseExitModal} url={linkExit} />
    </>
  );
}
