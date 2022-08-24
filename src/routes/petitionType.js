require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const petType = new PrismaClient().pet_types

router.get("/getPetitionType", async(req,res)=>{
    let test = await petType.findMany()
    if (test == undefined || test.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

module.exports = router