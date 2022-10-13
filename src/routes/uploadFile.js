require("../sdk/firebase")
const { getStorage } = require("firebase-admin/storage")
const multer = require("multer")
const sharp = require("sharp")
const router = require('express').Router()
const multerStorage = multer.memoryStorage()
const prismaErrorHandling = require("../services/prismaErrorHandler")
const bucket = getStorage().bucket()

const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

const imageUploader = multer({
    storage: multerStorage,
    fileFilter: filter
})

const resizeImageAndUpload = async (image) => {
    console.log("🚀 ~ file: uploadFile.js ~ line 24 ~ resizeImageAndUpload ~ image", image)
    let fileName = `${Date.now()}_${image.originalname}`
    const resizeImageFunction = async (buffer) => {
        let imageAfterResize = await sharp(buffer).jpeg({ quality: 80 }).toBuffer()
        if (imageAfterResize.byteLength > 5000000) {
            await resizeImageFunction(imageAfterResize)
        }
        return imageAfterResize
    }
    const resizedImage = await resizeImageFunction(image.buffer)
    await bucket.file(fileName).save(resizedImage)
    return fileName
}

router.post("/uploadFile", imageUploader.single('photo'), async (req, res, next) => {
    const { file: image } = req
    console.log("🚀 ~ file: uploadFile.js ~ line 40 ~ router.post ~ image", image)
    let fileName
    try {
        let imageName = await resizeImageAndUpload(image)
        fileName = `https://firebasestorage.googleapis.com/v0/b/smosit-project.appspot.com/o/${imageName}?alt=media`
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: fileName })
})

module.exports = router