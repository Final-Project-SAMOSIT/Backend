const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const { voting } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")

BigInt.prototype["toJSON"] = function () {
    return this.toString();
}

router.get('/getVoting', async (req, res) => {
    let { year = dayjs().year() } = req.query
    let results = await voting.findMany({
        where: {
            union_year: Number(year)
        }
    })
    return res.send({ data: results })
})

router.post('/createVoting', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { open_date, end_date, union_year } = req.body
    if (open_date > end_date) {
        return res.status(500).send({ error: "Invalid date" })
    }

    let result
    let exists = await voting.findMany({
        where: {
            union_year: union_year
        }
    })

    if (exists.length > 0) {
        return res.status(500).send({ error: "This year has already been created" })
    }

    try {
        result = await voting.create({
            data: req.body
        })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch('/updateVoting/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.status(500).send({ error: "Invalid id" })
    }
    let { open_date, end_date } = req.body
    if (open_date > end_date) {
        return res.status(500).send({ error: "Invalid date" })
    }

    let result
    try {
        result = await voting.update({
            where: {
                vote_id: id
            },
            data: req.body
        })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete('/deleteVoting/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.status(500).send({ error: "Invalid id" })
    }

    let result
    try {
        result = await voting.delete({
            where: {
                vote_id: id
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(500).send({ error: error.message })
    }
    return res.send({ data: "DELETED SUCCESSFULLY" })
})

module.exports = router