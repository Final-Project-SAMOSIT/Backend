require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { petition_types: petType } = Prisma

router.get("/getPetitionType", async (req, res) => {
    let test = await petType.findMany()
    if (test == undefined || test.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

module.exports = router