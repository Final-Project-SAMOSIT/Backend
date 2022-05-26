const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middlewares/auth.middleware')
const { user_details: userDetails } = new PrismaClient()
const axios = require("axios").default
const router = require('express').Router()

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
        // console.log("🚀 ~ file: auth.controller.js ~ line 17 ~ router.post ~ error", error)
        return res.status(error.response.status).send({ msg: error.response.data.message })
    }
    user = user.data
    let { token: accessToken } = user.token
    // Check user in DB
    let userInDb = await userDetails.findFirst({
        where: {
            user_id: user.user_id
        }
    })
    if (!userInDb) {
        user = await userDetails.create({ data: { user_id: user.user_id, user_type: user.user_type, name_th: user.name_th, name_en: user.name_en, email: user.email, role_id: `${user.roles[0].role_id}` } })
    }
    if (userInDb) {
        user = userInDb
    }
    return res.status(200).send({ data: { ...user, token: { token: accessToken } } })
})

// router.get("/auth/redirect", async (req, res) => {
//     let { code } = req.query
//     let result
//     try {
//         result = await authService.handleRedirect(code)
//     } catch (error) {
//         return res.status(400).send({ msg: error.message })
//     }
//     return res.send({ userDetail: result })
// })

router.get("/auth/check", authMiddleware, async (req, res) => {
    let { user_id } = req.user
    let userInDB = await userDetails.findUnique({ where: { user_id: user_id } })
    try {
        if (userInDB == undefined || userInDB.length < 0) {
            return res.status(204).send({ status: "Don't have any data" })
        }

    } catch (error) {
        return res.status(400).send({ msg: error.message })
    }

    return res.status(200).send({ userDetail: userInDB })
})

module.exports = router