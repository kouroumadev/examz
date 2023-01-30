import instance from "./instance";
import axios from "axios";

const QUESTION_ANSWER = "QUESTION_ANSWER"
const QUESTION = "QUESTION"
const ANSWER = "ANSWER"
const ANNOUNCEMENT = "ANNOUNCEMENT"
const BLOG = "BLOG"
const QUIZ = "QUIZ"
const imgUploadLink = (data) => instance.auth.post('/image-upload-link', data)
const uploadFileToS3 = (url, file) => {
    return axios.put(url, file, {
        headers: {
            'Content-Type': file.type
        }
    })
};

const S3 = {
    QUESTION_ANSWER,
    ANNOUNCEMENT,
    BLOG,
    QUIZ,
    QUESTION,
    ANSWER,
    uploadFileToS3,
    imgUploadLink
}
export default S3