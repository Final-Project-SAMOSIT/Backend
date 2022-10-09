const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const { student_union, union_year, student_union_info } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")

router.get("/getAllUnionYear", async (req, res) => {
    let results = []
    try {
        results = await union_year.findMany({
            where: {
                NOT: {
                    union_year: 9999
                }
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.get("/getAllUnionYearVote", async (req, res) => {
    let results = []
    try {
        results = await union_year.findMany({
            where: {
                is_accepted: false,
                NOT: {
                    union_year: 9999
                }
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.post('/createUnionYear', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { union_year: unionYear } = req.body
    let newsBody = {
        union_year: unionYear,
        is_accepted: false
    }

    let result
    try {
        result = await union_year.create({
            data: newsBody
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch('/updateUnionYear/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id } = req.params
    let result
    try {
        result = await union_year.update({
            where: {
                union_year: Number(id)
            },
            data: {
                is_accepted: true
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.get("/getStudentUnion", async (req, res) => {
    let results = []
    let { union_year = 0 } = req.query
    try {
        results = await student_union.findMany({
            where: {
                union_year: Number(union_year)
            },
            include: {
                student_union_info: true,
                std_position: true
            },
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.post('/createStudentUnion', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { body } = req
    let result
    try {
        result = await student_union.createMany({
            data: body
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch('/editStudentUnion/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { body } = req
    let { id } = req.params
    let result
    try {
        result = await student_union.update({
            where: {
                union_id: id
            },
            data: {
                std_id: body.std_id,
                position_id: body.position_id,
                union_year: body.union_year
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})


router.delete('/deleteStudentUnion/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id } = req.params
    let result
    try {
        result = await student_union.delete({
            where: {
                union_id: id
            },
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete('/deleteUnionYear/:id', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { id } = req.params
    let result
    try {
        result = await union_year.delete({
            where: {
                union_year: Number(id) 
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})


module.exports = router