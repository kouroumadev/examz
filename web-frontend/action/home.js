import instance from './instance'

// for  superadmin
const listInstitute = (keyword) => instance.auth.get('/home/institutes?search=' + keyword)
const totalInstituteStudent = () => instance.auth.get('/home/total-institute-student')
// for institute and staff
const totalStaffStudent = () => instance.auth.get('/home/total-staff-student')

const apiHome = {
  listInstitute,
  totalInstituteStudent,
  totalStaffStudent
}

export default apiHome