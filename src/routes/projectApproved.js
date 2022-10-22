const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const { form_info, project_approved } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")

router.get("/allProjectApproved", async (req, res) => {
    let { take = 6, skip = 0, user_id } = req.query
    let results = []
    let countDocument = 0
    try {
        results = await project_approved.findMany({
            where: {
                user_id: user_id
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
        countDocument = await project_approved.count({
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

router.get("/getProjectApproved/:id", async (req, res) => {
    let { id } = req.params
    let results = []
    try {
        results = await project_approved.findFirst({
            where: {
                project_id: id
            },
            include: {
                form_info: true
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})


module.exports = router