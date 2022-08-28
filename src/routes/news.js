require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { news_contents: news } = Prisma
const authMiddleware = require('../middlewares/auth.middleware')
const onlyPublisher = require("../middlewares/onlyPublisher")
const { v4: uuid } = require("uuid")
const { NEW_TYPE } = require("../constant/newTypeId")

router.get("/getNews", async (req, res) => {
    let results = []
    try {
        results = await news.findMany({
            where: {
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS
                    },
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    }
                ]
            },
            select: {
                news_id: true,
                news_title: true,
                news_details: true,
                news_created_at: true,
                news_updated_at: true,
                news_img: true,
                news_types: true
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.get("/getNews/:id", async (req, res) => {
    let { id = 0 } = req.params
    let result = {}
    try {
        result = await news.findFirst({
            where: {
                news_id: Number(id)
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    if (!result) {
        result = {}
    }
    return res.send({ data: result })
})

router.post("/addNews", authMiddleware, onlyPublisher, async (req, res) => {
    let { user, body } = req
    let { news_title, news_details, news_img, news_caption_img, union_year, news_type_id } = body
    let newsBody = {
        news_id: uuid(),
        news_title: news_title,
        news_details: news_details,
        news_created_at: new Date(),
        news_updated_at: new Date(),
        news_img: news_img,
        news_caption_img: news_caption_img,
        union_year: union_year,
        news_type_id: news_type_id,
        user_id: user.user_id
    }

    let result
    try {
        result = await news.create({
            data: newsBody
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch("/editNews/:id", authMiddleware, onlyPublisher, async (req, res) => {
    let { body } = req
    let { id: news_id } = req.params

    let result
    try {
        result = await news.update({
            where: {
                news_id: news_id
            },
            data: { ...body, news_updated_at: new Date() }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete("/deleteNews/:id", authMiddleware, onlyPublisher, async (req, res) => {
    let { id: news_id = 0 } = req.params

    let result
    try {
        result = await news.delete({
            where: {
                news_id: Number(news_id)
            },
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.get("/getExperiences", async (req, res) => {
    let { take = 3, skip = 0 } = req.query
    let result = []
    let countDocument = 0
    try {
        result = await news.findMany({
            where: {
                news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
            },
            take: Number(take),
            skip: Number(skip)
        })
        countDocument = await news.count({
            where: {
                news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result, allItem: countDocument, take: take, skip: skip })
})

module.exports = router