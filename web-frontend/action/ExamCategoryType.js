import instance from './instance'

const allCategory = () => instance.auth.get('/exam-category')
const allType = () => instance.auth.get('/exam-type')
const allInstruction = () => instance.auth.get('/instruction')
const allConfig = () => instance.auth.get('/exam-configuration')

const apiExamCategoryType = {
    allCategory, allType, allConfig, allInstruction
}

export default apiExamCategoryType
