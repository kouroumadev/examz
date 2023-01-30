import { useRouter } from "next/router";
import Link from 'next/link'
import { store } from './../../redux/store'
import { useState, useEffect } from 'react'
import role from "../../redux/role";
import Image from "next/image";

function Sidebar() {
  const router = useRouter();
  const [itemList, setItemList] = useState([])
  const uri = "/asset/icon/sidebar/"
  const roleStore = store.getState().auth.user.user.roles[0].name
  const admin = [{
    icon: uri + 'ic_home.svg',
    active: uri + 'ic_home_active.svg',
    name: 'Home',
    path: '/admin/dashboard'
  }, {
    icon: uri + 'ic_institute.svg',
    active: uri + 'ic_institute_active.svg',
    name: 'Institute',
    path: '/admin/institution'
  }, {
    icon: uri + 'ic_institute_admin.svg',
    active: uri + 'ic_institute_admin_active.svg',
    name: 'Institute Admin',
    path: '/admin/institute-admin'
  }, {
    icon: uri + 'ic_institute_branch.svg',
    active: uri + 'ic_institute_branch_active.svg',
    name: 'Institute Branch',
    path: '/admin/institute-branch'
  }, {
    icon: uri + 'ic_operator.svg',
    active: uri + 'ic_operator_active.svg',
    name: 'Operator Team',
    path: '/admin/operator'
  }, {
    icon: uri + 'ic_topics.svg',
    active: uri + 'ic_topics_active.svg',
    name: 'Topics',
    path: '/admin/topics'
  }, {
    icon: uri + 'ic_exams.svg',
    active: uri + 'ic_exams_active.svg',
    name: 'Exams',
    path: '/admin/exams'
  }, {
    icon: uri + 'ic_practice.svg',
    active: uri + 'ic_practice_active.svg',
    name: 'Practice Test',
    path: '/admin/practice'
  }, {
    icon: uri + 'ic_quizzes.svg',
    active: uri + 'ic_quizzes_active.svg',
    name: 'Quizzes',
    path: '/admin/quizzes'
  }, {
    icon: uri + 'ic_news.svg',
    active: uri + 'ic_news_active.svg',
    name: 'News',
    path: '/admin/news'
  },
  ]
  const instituteAdmin = [{
    icon: uri + 'ic_home.svg',
    active: uri + 'ic_home_active.svg',
    name: 'Home',
    path: '/institute/home'
  }, {
    icon: uri + 'ic_institute_branch.svg',
    active: uri + 'ic_institute_branch_active.svg',
    name: 'Institute Branch',
    path: '/institute/branch'
  }, {
    icon: uri + 'ic_institute_admin.svg',
    active: uri + 'ic_institute_admin_active.svg',
    name: 'Staff',
    path: '/institute/staff'
  }, {
    icon: uri + 'ic_student.svg',
    active: uri + 'ic_student_active.svg',
    name: 'Students',
    path: '/institute/student'
  }, {
    icon: uri + 'ic_exams.svg',
    active: uri + 'ic_exams_active.svg',
    name: 'Exams',
    path: '/institute/exams'
  }, {
    icon: uri + 'ic_announcement.svg',
    active: uri + 'ic_announcement_active.svg',
    name: 'Announcement',
    path: '/institute/announcement'
  },
  ]
  const staff = [{
    icon: uri + 'ic_home.svg',
    active: uri + 'ic_home_active.svg',
    name: 'Home',
    path: '/staff/home'
  }, {
    icon: uri + 'ic_institute_branch.svg',
    active: uri + 'ic_institute_branch_active.svg',
    name: 'Institute Branch',
    path: '/staff/branch'
  }, {
    icon: uri + 'ic_student.svg',
    active: uri + 'ic_student_active.svg',
    name: 'Students',
    path: '/staff/student'
  }, {
    icon: uri + 'ic_exams.svg',
    active: uri + 'ic_exams_active.svg',
    name: 'Exams',
    path: '/staff/exams'
  }, {
    icon: uri + 'ic_announcement.svg',
    active: uri + 'ic_announcement_active.svg',
    name: 'Announcement',
    path: '/staff/announcement'
  },
  ]
  const operator = [{
    icon: uri + 'ic_exams.svg',
    active: uri + 'ic_exams_active.svg',
    name: 'Exams',
    path: '/operator/exams'
  }, {
    icon: uri + 'ic_practice.svg',
    active: uri + 'ic_practice_active.svg',
    name: 'Practice Test',
    path: '/operator/practice'
  }, {
    icon: uri + 'ic_quizzes.svg',
    active: uri + 'ic_quizzes_active.svg',
    name: 'Quizzes',
    path: '/operator/quizzes'
  },
  ]
  const student = [{
    icon: uri + 'ic_home.svg',
    active: uri + 'ic_home_active.svg',
    name: 'Home',
    path: '/student/home'
  }, {
    icon: uri + 'ic_goals.svg',
    active: uri + 'ic_goals_active.svg',
    name: 'My Goals',
    path: '/student/goals'
  }, {
    icon: uri + 'ic_practice.svg',
    active: uri + 'ic_practice_active.svg',
    name: 'Practice Test',
    path: '/student/practice'
  }, {
    icon: uri + 'ic_exams.svg',
    active: uri + 'ic_exams_active.svg',
    name: 'Exams',
    path: '/student/exams'
  }, {
    icon: uri + 'ic_quizzes.svg',
    active: uri + 'ic_quizzes_active.svg',
    name: 'Quizzes',
    path: '/student/quizzes'
  }, {
    icon: uri + 'ic_attemped.svg',
    active: uri + 'ic_attempted_active.svg',
    name: 'Attempted',
    path: '/student/attempted'
  }, {
    icon: uri + 'ic_news.svg',
    active: uri + 'ic_news_active.svg',
    name: 'News',
    path: '/student/news'
  },
  ]
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
  return (
    <div className="py-16 bg-white fixed h-screen">
      {roleStore === role.instituteAdmin && (
        <div className="hidden md:flex bg-black-9 m-2 rounded-lg p-2 flex gap-4 mb-2">
          <Image src="/asset/icon/sidebar/ic_college.svg" height="32" width="32" alt="icon campus" />
          <span className="text-black-1 m-auto">Hardvard Campus</span>
        </div>
      )}
      {roleStore === role.staff && (
        <div className="hidden md:flex bg-black-9 m-2 rounded-lg p-2 flex gap-4 mb-2">
          <Image src="/asset/icon/sidebar/ic_college.svg" height="32" width="32" alt="icon campus" />
          <span className="text-black-1 m-auto">Hardvard Campus</span>
        </div>
      )}
      <ul className="px-4 inline-block w-60 md:inline-block hidden">
        {itemList.map((item, index) => {
          const isActive = router.pathname.indexOf(item.path) !== -1
          return (
            <li key={index} className={` ${isActive ? 'bg-blue-1 text-white shadow-lg' : 'bg-white'} flex px-2 gap-4 mt-1 rounded-lg  inline-block block py-2 text-black-3 `}>
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
      </ul>
    </div>
  )
}

export default Sidebar