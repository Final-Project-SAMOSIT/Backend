const router = require('express').Router()
const authController = require('./auth.controller')
const petitionType = require('./petitionType')
const petitionStatus = require('./petitionStatus')
const users = require('./users')
const petition = require('./petition')
const news = require("./news")
const uploadFile = require("./uploadFile")
const studentUnion = require("./studentUnion")

router.use(authController)
router.use(petitionType)
router.use(petitionStatus)
router.use(users)
router.use(petition)
router.use(news)
router.use(uploadFile)
router.use(studentUnion)

router.get("/", (req, res) => {
    return res.send({ api: "SAMOSIT" })
})

router.get("/health", (req, res) => {
    return res.send({ status: "healthy" })
})

// export router
module.exports = router
