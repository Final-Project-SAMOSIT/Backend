const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const { student_union_info } = Prisma

router.get("/getStudentUnionInfo/:id", async (req, res) => {
    let { id } = req.params
    let result = {}
    try {
        result = await student_union_info.findFirst({
            where: {
                std_id: id
            }
        })

    if (result == undefined || result.length < 0) {
        return res.status(204).send({ status: "Don't have any data" })
    }
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.post('/createStudentUnionInfo', async (req, res) => {
    let { body } = req
    let result
    try {
        result = await student_union_info.create({
            data: {
                std_id: body.std_id,
                std_fname_th: body.std_fname_th,
                std_lname_th: body.std_lname_th,
                std_fname_en: body.std_fname_en,
                std_lname_en: body.std_lname_en,
                std_img: body.std_img
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch('/editStudentUnionInfo/:id', async (req, res) => {
    let { body } = req
    let { id } = req.params
    let result
    try {
        result = await student_union_info.update({
            where: {
                std_id: id
            },
            data: {
                std_fname_th: body.std_fname_th,
                std_lname_th: body.std_lname_th,
                std_fname_en: body.std_fname_en,
                std_lname_en: body.std_lname_en,
                std_img: body.std_img
            }
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete('/deleteStudentUnionInfo/:id', async (req, res) => {
    let { id } = req.params
    let result
    try {
        result = await student_union_info.delete({
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