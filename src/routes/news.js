require("dotenv").config()
const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { news_contents: news } = Prisma
const authMiddleware = require('../middlewares/auth.middleware')
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const { NEW_TYPE } = require("../constant/newTypeId")
const dayjs = require("dayjs")

router.get("/getNews", async (req, res) => {
    let results = []
    let { take = 3, skip = 0, news_id } = req.query
    let countDocument = 0
    try {
        results = await news.findMany({
            where: {
                NOT: {
                    news_id: news_id
                },
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
            },
            take: Number(take),
            skip: Number(skip),
            orderBy: {
                news_created_at: "desc"
            }
        })
        countDocument = await news.count({
            where: {
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS
                    },
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    }
                ]
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results, allItem: countDocument, take: take, skip: skip })
})

router.get("/getNews/:id", async (req, res) => {
    let { id } = req.params
    let result = {}
    try {
        result = await news.findFirst({
            where: {
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS
                    },
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    }
                ],
                news_id: id
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

router.post("/addNews", authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { user, body } = req
    let { news_title, news_details, news_img, news_caption_img, union_year, news_type_id } = body
    let newsBody = {
        news_title: news_title,
        news_details: news_details,
        news_created_at: dayjs().toDate(),
        news_updated_at: dayjs().toDate(),
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

router.patch("/editNews/:id", authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { body } = req
    let { id: news_id } = req.params

    let result
    try {
        result = await news.update({
            where: {
                news_id: news_id
            },
            data: { ...body, news_updated_at: dayjs().toDate() }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete("/deleteNews/:id", authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id: news_id } = req.params

    let result
    try {
        result = await news.delete({
            where: {
                news_id: news_id
            },
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.get("/getExperiences", async (req, res) => {
    let { take = 3, skip = 0, union_year, news_id } = req.query
    let result = []
    let countDocument = 0
    try {
        result = await news.findMany({
            where: {
                NOT: {
                    news_id: news_id
                },
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    },
                    {
                        news_type_id: NEW_TYPE.EXPERIENCE
                    }
                ],
                union_year: Number(union_year)
            },
            take: Number(take),
            skip: Number(skip),
            orderBy: {
                news_created_at: "desc"
            }
        })
        countDocument = await news.count({
            where: {
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    },
                    {
                        news_type_id: NEW_TYPE.EXPERIENCE
                    }
                ]
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result, allItem: countDocument, take: take, skip: skip })
})

router.get("/getExperiences/:id", async (req, res) => {
    let { id } = req.params
    let result = {}
    try {
        result = await news.findFirst({
            where: {
                OR: [
                    {
                        news_type_id: NEW_TYPE.NEWS_AND_EXPERIENCE
                    },
                    {
                        news_type_id: NEW_TYPE.EXPERIENCE
                    }
                ],
                news_id: id
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

module.exports = router