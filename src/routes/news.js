require("dotenv").config()
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const news = new PrismaClient().news

router.get("/getNews", async (req, res) => {
    try {
        let test = await news.findMany({
            include: {
                status: true,
                pet_types: true
            },
            orderBy: {
                pet_date: "asc"
            }
        })
        if (test == undefined || test.length < 0) {
            return res.status(204).send({ status: "Don't have any data" })
        }

        return res.send({ data: test })
    } catch (error) {
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }
    
})
