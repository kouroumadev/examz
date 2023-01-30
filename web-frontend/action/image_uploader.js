import config from "../config";
import {apiImgUpload} from "./img";
import instance from "./instance";
import s3 from "./s3";

export async function uploadImage(file, type, subType) {
    const body = new FormData();
    body.append('file', file);
    if (config.s3Enabled) {
        let s3UploadLink = undefined
        let fileLink = undefined
        await s3.imgUploadLink({upload_type: type, upload_sub_type: subType, name: file.name, file_type: file.type, size: file.size}).then((res) => {
            console.log(res.data)
            s3UploadLink = res.data.upload_link
            fileLink = res.data.file_link
        }).catch((err) => {
            console.log(err)
        })
        if (s3UploadLink !== undefined) {
            return await s3.uploadFileToS3(s3UploadLink, file).then((res) => {
                console.log(res)
                return Promise.resolve(fileLink)
            }).catch((err) => console.log(err))
        }
    } else {
        return await apiImgUpload(body)
            .then((res) => {
                console.log(res.data.data.image)
                return Promise.resolve(instance.pathImg + res.data.data.image);
            }).catch((err) => console.log(err))
    }
}