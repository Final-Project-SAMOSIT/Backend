require("dotenv").config()
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const petStatus = new PrismaClient().status

router.get("/getPetitionStatus", async(req,res)=>{
    let test = await petStatus.findMany()
    if (test == undefined || test.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

module.exports = router