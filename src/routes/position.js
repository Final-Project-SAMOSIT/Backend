require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { std_position } = Prisma

router.get("/getPosition", async (req, res) => {
    let result = await std_position.findMany()
    if (result == undefined || result.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

module.exports = router