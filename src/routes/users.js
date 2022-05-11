require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const users = new PrismaClient().user_details
const roles = new PrismaClient().roles

router.get("/getUsers", async(req,res)=>{
    let test = await users.findMany()
    if (test == undefined || test.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

module.exports = router