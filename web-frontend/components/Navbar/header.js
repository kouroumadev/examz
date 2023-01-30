import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router';
import apiExam from "../../action/exam";
import Button from "../Button/button";
import { FiMenu } from "react-icons/fi";
import apiExamCategoryType from "../../action/ExamCategoryType";
function Header() {
  const { pathname, asPath } = useRouter();
  const [active, setActive] = useState(false);
  const params = asPath.split('?').length > 1 ? '?' + asPath.split('?')[1] : ''
  const [category, setCategory] = useState([])
  const [activeSidebar, setActiveSidebar] = useState(false)
  const [listCategory, setListCategory] = useState([])
  const [listType, setListType] = useState([])
  const [chooseCategory, setChooseCategory] = useState('Category')
  const [idChooseCategory, setIdChooseCategory] = useState()
  const [iconCategory, setIconCategory] = useState([])
  const router = useRouter();
  const handleClick = () => {
    setActive(!active);
  };
  const menu = [
    {
      id: -1,
      slug: '/quizzes' + params,
      name: 'Quizzes'
    },
    {
      id: -2,
      slug: '/prev-paper' + params,
      name: 'Prev Paper'
    },
    {
      id: -3,
      slug: '/upcoming-exam' + params,
      name: 'Upcoming Exam'
    },
    {
      id: -4,
      slug: '/exam' + params,
      name: 'Exams'
    },
  ]
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  useEffect(async () => {
    let idCategory = []
    const splitUrl = asPath.split('=')
    if (splitUrl.length === 2) {
      setIdChooseCategory(splitUrl[1])
      idCategory.push(splitUrl[1])
    }
    if (splitUrl.length === 3) {
      const newSplit = asPath.split('=')[1].split('&')[0]
      setIdChooseCategory(newSplit)
      idCategory.push(newSplit)
    }

    await apiExam.AllCategory()
      .then((res) => {
        setCategory(res.data.data)
        res.data.data.map((item) => {
          if (item.id.toString() === idCategory[0]) {
            setChooseCategory(item.name)
          }
        })
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const getListCategory = async () => {
      await apiExamCategoryType.allCategory()
        .then((res) => {
          setListCategory(res.data.data)
        })
    }
    const getListType = async () => {
      await apiExamCategoryType.allType()
        .then((res) => {
          setListType(res.data.data)
          let idCategory = []
          res.data.data.map((item) => {
            idCategory.push(item.exam_category_id)
          })
          let uniq = [...new Set(idCategory)];
          setIconCategory(uniq)
        })
    }
    getListCategory()
    getListType()
  }, [])

  const onCategory = (id) => {
    window.location.href = window.location.origin + window.location.pathname + "?category=" + id
  }

  const onType = (idCategory, idType) => {
    window.location.href = window.location.origin + window.location.pathname + "?category=" + idCategory + "&type=" + idType
  }

  return (
    <>
      <div className="flex hidden md:flex bg-blue-1 md:px-12 py-4 gap-8 md:justify-between fixed w-full top-0 z-50">
        <h1 className="text-white text-3xl mx-4"><Link href="/landing"><a> Examz</a></Link></h1>
        <div>
          <ul className="pt-4 hidden md:flex text-white flex md:flex-row flex-col gap-5">
            {menu.map((item) => {
              const status = {
                color: item.slug === pathname ? 'text-yellow-1 font-bold border-b border-yellow-1' : 'text-white'
              }
              return (
                <li key={item.id} className={`${status.color} hover:text-yellow-1 hover:font-bold hover:border-b hover:border-yellow-1`}><Link href={item.slug}><a>{item.name}</a></Link></li>
              )
            })}
          </ul>
        </div>
        <div className="md:flex hidden md:flex-row flex-col gap-4 justify-center">
          <div className="group inline-block">
            <button
              className="outline-none focus:outline-none border px-3 py-2 py-1 bg-white rounded-sm flex items-center min-w-32"
            >
              <span className="pr-1 font-semibold flex-1">{chooseCategory}</span>
              <span>
                <svg
                  className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </span>
            </button>
            <ul
              className="bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32"
            >
              {listCategory.map((item, index) => (
                <li key={item.id} className="rounded-sm relative px-3 py-1 hover:bg-gray-100 dropdown" >
                  <button
                    className="w-full text-left flex items-center outline-none focus:outline-none"
                  >
                    <span className="pr-1 flex-1" onClick={() => {
                      onCategory(item.id)
                      setChooseCategory(item.name)
                    }}>{item.name}</span>
                    {iconCategory.map((itemType, indexType) => {
                      const isSame = item.id === itemType
                      return (
                        <>
                          {isSame && (
                            <span key={itemType} className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )
                    })}
                  </button>
                  <ul className="bg-white rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32">
                    {listType.map((itemType, indexType) => {
                      const isSame = item.id === itemType.exam_category_id
                      return (
                        <>
                          {isSame && (
                            <li key={itemType.id} className="px-3 cursor-pointer py-1 hover:bg-gray-100 dropdown" onClick={() => {
                              onType(item.id, itemType.id)
                              setChooseCategory(item.name)
                            }}>{itemType.name}</li>
                          )}
                        </>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <Button title="Register" href="/landing#register" />
        </div>
      </div >

      {/* Mobile */}
      <nav className='flex md:hidden bg-blue-1 md:px-12 py-2  justify-between fixed w-full top-0 z-50 '>
        <div className="flex">
          <div className="md:hidden my-auto mx-2" onClick={() => {
            setActiveSidebar(!activeSidebar)
          }}>
            <FiMenu color="white" />
          </div>
          <h1 className="text-white text-2xl md:mx-4 my-auto"><Link href="/"><a> Examz</a></Link></h1>
        </div>
        <div>
          <div className="group inline-block">
            <button
              className="outline-none focus:outline-none border py-2 bg-white rounded-sm flex items-center min-w-32"
            >
              <span className="pr-1 font-semibold text-sm flex-1">{chooseCategory}</span>
              <span>
                <svg
                  className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </span>
            </button>
            <ul
              className="bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32"
            >
              {listCategory.map((item, index) => (
                <li key={index} className="rounded-sm relative px-3 py-1 hover:bg-gray-100 dropdown" >
                  <button
                    className="w-full text-left flex gap-4 items-center outline-none focus:outline-none"
                  >
                    <span className="flex-1" onClick={() => {
                      onCategory(item.id)
                      setChooseCategory(item.name)
                    }}>{item.name} </span>
                    {iconCategory.map((itemType, indexType) => {
                      const isSame = item.id === itemType ? true : false
                      return (
                        <>
                          {isSame && (
                            <span key={indexType} className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )
                    })}
                  </button>
                  <ul className="bg-white rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32" >
                    {listType.map((itemType, indexType) => {
                      const isSame = item.id === itemType.exam_category_id ? true : false
                      return (
                        <>
                          {isSame && (
                            <li key={indexType} className="px-3 cursor-pointer py-1 hover:bg-gray-100 dropdown" onClick={() => {
                              onType(item.id, itemType.id)
                              setChooseCategory(item.name)
                            }}>{itemType.name}</li>
                          )}
                        </>
                      )
                    })}
                  </ul>

                </li>
              ))}
              {/* <li className="rounded-sm cursor-pointer px-3 py-1 hover:bg-gray-100 dropdown">Medical</li>
              <li className="rounded-sm cursor-pointer px-3 py-1 hover:bg-gray-100 dropdown">Bank</li> */}
            </ul>
          </div>
          <Link href="/landing#register">
            <a>
              <button className={`bg-blue-1 text-white py-2 border-white border mx-2 px-4 font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl `}>Register</button>
            </a>
          </Link>
        </div>

      </nav>
      <ul className={`py-16 bg-white fixed z-40 h-screen w-screen ${activeSidebar ? '' : 'hidden'}`}>
        {menu.map((item, index) => {
          const isActive = router.pathname.indexOf(item.slug) !== -1
          return (
            <li key={index} className={` ${isActive ? 'bg-blue-1 text-white shadow-lg' : 'bg-white'} flex border-b px-2 gap-4 mt-1   inline-block block py-2 text-black-3 `} onClick={() => setActiveSidebar(!activeSidebar)}>
              <Link href={item.slug}>
                <a className="flex gap-4 inline-block cursor-pointer p-1 rounded">
                  <span className="text-sm"> {item.name}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Header