const router = require('express').Router()
const authController = require('./auth.controller')
const petitionType = require('./petitionType')
const petitionStatus = require('./petitionStatus')
const users = require('./users')
const petition = require('./petition')
const axios = require("axios").default

router.use(authController)
router.use(petitionType)
router.use(petitionStatus)
router.use(users)
router.use(petition)

router.get("/", (req, res) => {
    return res.send({ api: "SAMOSIT" })
})

router.get("/health", (req, res) => {
    return res.send({ status: "healthy" })
})

router.post('/auth', async (req, res) => {
    const { code } = req.body
    const clientSecret = process.env.CLIENT_SECRET
    const clientId = process.env.CLIENT_ID
    const redirectURI = process.env.REDIRECT_URI
    if (!clientSecret) {
        throw new Error("require client secret in BE env")
    }
    let user
    try {
        user = await axios.get(`https://gatewayservice.sit.kmutt.ac.th/api/oauth/token?client_secret=${clientSecret}&client_id=${clientId}&code=${code}&redirect_uri=${redirectURI}`)
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
    // let user = await axios.get(`https://gatewayservice.sit.kmutt.ac.th/api/oauth/token?client_secret=${clientSecret}&client_id=${clientId}&code=${code}&redirect_uri=${redirectURI}`)
    user = user.data
    return res.status(200).send({ data: user })
    // return res.send(user)
})

// export router
module.exports = router
