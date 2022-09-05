const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const { student_union, union_year } = Prisma

router.get("/getAllUnionYear", async (req, res) => {
    let results = []
    try {
        results = await union_year.findMany({
            where: {
                NOT:{
                    union_year:9999
                }
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
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
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results })
})

router.post('/createStudentUnion', async (req, res) => {
    let { body } = req
    let result
    try {
        result = await student_union.create({
            data: body
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch('/editStudentUnion/:id', async (req, res) => {
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
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete('/deleteStudentUnion/:id', async (req, res) => {
    let { id } = req.params
    let result
    try {
        result = await student_union.delete({
            where: {
                union_id: id
            },
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

module.exports = router