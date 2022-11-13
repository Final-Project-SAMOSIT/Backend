require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const authMiddleware = require('../middlewares/auth.middleware')
let { user_details: users, roles } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")

router.get("/getUsers", authMiddleware, roleAuth([Role.ADMIN]), async (req, res) => {
    let results = await users.findMany({
        orderBy: {role_id: "asc"}
    })
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
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.patch('/updateUser/:id', authMiddleware, roleAuth([Role.ADMIN]), async (req, res) => {
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
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.get('/user/me', authMiddleware, async (req, res) => {
    let { user_id, name_en } = req.user
    let results = {
        user_id,
        name_en
    }
    return res.send({ data: results })
})

module.exports = router