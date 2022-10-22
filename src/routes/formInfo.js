const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const { form_info, project_approved, request_info } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")

router.get("/allDocument", async (req, res) => {
    let { take = 6, skip = 0, user_id } = req.query
    let results = []
    let countDocument = 0
    try {
        results = await form_info.findMany({
            where: {
                project_approved: {
                    every: {
                        user_id: user_id
                    }
                }
            },
            take: Number(take),
            skip: Number(skip),
            orderBy: {
                created_date: "desc"
            }
        })
        countDocument = await form_info.count({
            where: {
                project_approved: {
                    every: {
                        user_id: user_id
                    }
                }
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: results, allItem: countDocument, take: take, skip: skip })
})

router.post("/createProjectApproved", authMiddleware, roleAuth([Role.USER,Role.PUBLISHER]), async (req, res) => {
    let { body, user } = req
    let { form_info: formBody, project_name, club_name, start_date, end_date, location, project_purpose, about_project, cost, cost_des_th } = body
    let { form_no, institution, solution, contact, tel, form_type } = formBody
    let formInfoBody = {
        form_no: form_no,
        institution: institution,
        solution: solution,
        created_date: new Date(),
        contact: contact,
        Tel: tel,
        form_type: form_type,
    }

    let approveProject = {
        project_name: project_name,
        club_name: club_name,
        start_date: start_date,
        end_date: end_date,
        location: location,
        project_purpose: project_purpose,
        about_project: about_project,
        cost: cost,
        cost_des_th: cost_des_th,
        user_id: user.user_id
    }

    let result
    try {
        let formInfoBodyResponse = await form_info.create({
            data: formInfoBody
        })
        approveProject.form_info_id = formInfoBodyResponse.form_info_id
        result = await project_approved.create({
            data: approveProject
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch("/updateProjectApproved/:fid/:pid", authMiddleware, roleAuth([Role.USER,Role.PUBLISHER]), async (req, res) => {
    let { body, user } = req
    let { form_info: formBody, project_name, club_name, start_date, end_date, location, project_purpose, about_project, cost, cost_des_th } = body
    let { form_no, institution, solution, contact, tel, form_type } = formBody
    let formInfoBody = {
        form_no: form_no,
        institution: institution,
        solution: solution,
        contact: contact,
        Tel: tel,
        form_type: form_type,
    }

    let approveProject = {
        project_name: project_name,
        club_name: club_name,
        start_date: start_date,
        end_date: end_date,
        location: location,
        project_purpose: project_purpose,
        about_project: about_project,
        cost: cost,
        cost_des_th: cost_des_th,
        user_id: user.user_id
    }

    let result
    try {
        await form_info.update({
            where: {
                form_info_id: req.params.fid
            },
            data: formInfoBody
        })
        result = await project_approved.update({
            where: {
                project_id: req.params.pid
            },
            data: approveProject
        })
    }
    catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.delete("/deleteProjectApproved/:fid", authMiddleware, roleAuth([Role.USER,Role.PUBLISHER]), async (req, res) => {
    let result
    try {
        result = await form_info.delete({
            where: {
                form_info_id: req.params.fid
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

module.exports = router