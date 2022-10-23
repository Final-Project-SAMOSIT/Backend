const { Prisma } = require('../constant/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { request_info: requestInfo, request_approved: requestApproved } = Prisma
const router = require('express').Router()
const prismaErrorHandling = require("../services/prismaErrorHandler")

router.get('/allRequestInfo', async (req, res) => {
    let { take = 6, skip = 0, user_id } = req.query
    let results = []
    let countDocument = 0
    try {
        results = await requestInfo.findMany({
            where: {
                user_id: user_id,
            },
            include: {
                form_info: true
            },
            take: Number(take),
            skip: Number(skip),
            orderBy: {
                form_info: {
                    created_date: "desc"
                }
            }
        })
        countDocument = await requestInfo.count({
            where: {
                user_id: user_id
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results, allItem: countDocument, take: take, skip: skip })
})

router.get("/getRequestApproved/:id", async (req, res) => {
    let { id } = req.params
    let results = []
    try {
        results = await requestApproved.findMany({
            select: {
                sub_activity_id: true,
                activity_hour: true
            },
            where: {
                request_info_id: id
            },
        })
        let requestInfoResponse = await requestInfo.findFirst({
            where: {
                request_info_id: id
            },
            include: {
                form_info: true
            }
        })
        results = {
            requestInfo: requestInfoResponse,
            requestApproved: results
        }
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

module.exports = router