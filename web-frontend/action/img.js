import instance from "./instance"
export const apiImgUpload = (data) => instance.authwithFile.post('/image-upload', data)
