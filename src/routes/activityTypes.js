require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { activity_types,sub_activity_types } = Prisma

router.get("/getActivityTypes", async (req, res) => {
    let result = await activity_types.findMany()
    if (result == undefined || result.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

router.get("/getSubActivityTypes", async (req, res) => {
    let { activity_id } = req.query
    let result = await sub_activity_types.findMany({
        where: {
            activity_id:activity_id
        }
    })
    if (result == undefined || result.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

module.exports = router