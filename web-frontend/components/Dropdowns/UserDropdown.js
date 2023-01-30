import React, { useState } from "react";
import { createPopper } from "@popperjs/core";
import { FiChevronDown} from 'react-icons/fi'
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { reSetCurrentUser } from "../../action/auth/authAction";
import Link from 'next/link'
import { useDisclosure} from "@chakra-ui/react";

const UserDropdown = (props) => {
  const [open, setOpen] = useState()
  const Router = useRouter()
  const dispatch = useDispatch()
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>

      <a
        className="text-blueGray-500 block"
        href=""
        ref={btnDropdownRef}
        onClick={(e) => {
          setOpen(true)
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex md:space-x-5 space-x-1 text-white py-2 text-east-bay-500">
          {/* <span className="w-12 h-12 text-sm bg-blueGray-200 inline-flex items-center justify-center rounded-full">
        <img
          alt="..."
          className="rounded-full align-middle border-none shadow-lg w-8 h-8"
          src="/img/team-1-800x800.jpg"
        />
      </span> */}
          <span className="md:ml-4 ml-1 ">{props.username || ''}</span>
          <div>
            <FiChevronDown size={16} className="mr-4" />
          </div>
        </div>
      </a>
      <main
        className={
          "fixed overflow-hidden w-full z-100 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
          (open
            ? " opacity-100  "
            : "  opacity-0 translate-x-full  ")
        }
      >
        <section
          className={
            " bg-white mt-12 mr-4 text-base z-50 right-0 float-right py-2 list-none rounded shadow-lg min-w-48 flex flex-col p-4 gap-1 "
            // (open ? " translate-x-0 " : " translate-x-full ")
          }
        >
          <Link href='/account/profile' >
            <a onClick={() => setOpen(false)}>
              <button className="text-left font-medium" onClick={closeDropdownPopover}>Edit Profile</button>
            </a>
          </Link>
          <Link href='/account/password'>
            <a onClick={() => setOpen(false)}>
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
      </main>
    </>
    // <>
    //   <a
    //     className="text-blueGray-500 block"
    //     href="#pablo"
    //     ref={btnDropdownRef}
    //     onClick={(e) => {
    //       e.preventDefault();
    //       dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
    //     }}
    //   >
    // <div className="items-center flex space-x-5 text-white py-2 text-east-bay-500">
    //   {/* <span className="w-12 h-12 text-sm bg-blueGray-200 inline-flex items-center justify-center rounded-full">
    //     <img
    //       alt="..."
    //       className="rounded-full align-middle border-none shadow-lg w-8 h-8"
    //       src="/img/team-1-800x800.jpg"
    //     />
    //   </span> */}
    //   <span className="ml-4">{props.username || ''}</span>
    //   <FiChevronDown size={16} />
    // </div>
    //   </a>
    //   <section
    //     ref={popoverDropdownRef}
    //     className={
    //       (dropdownPopoverShow ? "block " : "hidden ") +
    //       "bg-white text-base z-50 float-left py-2 list-none rounded shadow-lg min-w-48 flex flex-col p-4 gap-1  "
    //     }
    //   >
    //     <Link href='/account/profile'>
    //       <a>
    //         <button className="text-left font-medium" onClick={closeDropdownPopover}>Edit Profile</button>
    //       </a>
    //     </Link>
    //     <Link href='/account/password'>
    //       <a>
    //         <button className="font-medium">Change Password</button>
    //       </a>
    //     </Link>
    //     <button
    //       className={
    //         "font-medium block w-full whitespace-nowrap bg-transparent text-red-1 text-left"
    //       }
    //       onClick={(e) => {
    //         if (window !== undefined) {
    //           dispatch(reSetCurrentUser({}));
    //           localStorage.removeItem('ACCESS_TOKEN')
    //           Router.replace('/')
    //         }
    //       }}
    //     >
    //       Logout
    //     </button>
    //   </section>
    //   <section
    //     className={(dropdownPopoverShow ? "block" : "hidden ") + "w-screen h-full bg-green-300 cursor-pointer" }
    //     onClick={() => {
    //       setIsOpen(false);
    //     }}
    //   ></section>
    // </>
  );
};


const mapStateToProps = (state) => ({
  ...state.auth
});
export default connect(mapStateToProps)(UserDropdown);
