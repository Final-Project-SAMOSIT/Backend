const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const { student_union, union_year, student_union_info } = new PrismaClient()

router.get("/getAllStdUnion", async (req, res) => {
    let results = []
    try {
        results = await union_year.findMany()
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.get("/getStudentUnion", async (req, res) => {
    let results = []
    let { union_year } = req.params
    try {
        results = await student_union.findMany({
            where: {
                union_year: union_year
            },
            include: {
                student_union_info: true,
                std_position: true
            },
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

module.exports = router