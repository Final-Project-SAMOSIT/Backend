require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { status: petStatus } = Prisma

router.get("/getPetitionStatus", async (req, res) => {
    let test = await petStatus.findMany()
    if (test == undefined || test.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

module.exports = router