require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { news_types } = Prisma

router.get("/getNewsType", async (req, res) => {
    let result = await news_types.findMany()
    if (result == undefined || result.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

module.exports = router