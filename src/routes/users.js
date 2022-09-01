require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const onlyAdmin = require("../middlewares/onlyAdmin")
const authMiddleware = require('../middlewares/auth.middleware')
let { user_details: users, roles } = Prisma

router.get("/getUsers", async (req, res) => {
    let results = await users.findMany()
    if (results == undefined || results.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: results })
})

router.get('/allRole', async (req, res) => {
    let results
    try {
        results = await roles.findMany()
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.patch('/updateUser/:id', authMiddleware, onlyAdmin, async (req, res) => {
    let { id } = req.params
    let { body } = req
    let results
    try {
        results = await users.update({
            where: {
                user_id: id
            },
            data: body
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

module.exports = router