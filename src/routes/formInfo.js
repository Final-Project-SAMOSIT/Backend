const router = require('express').Router()
const { Prisma } = require('../constant/prisma')
const authMiddleware = require('../middlewares/auth.middleware')
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const { form_info, project_approved, request_info, request_approved } = Prisma
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
            include: {
                project_approved: true,
                request_info: true
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

router.post("/createProjectApproved", authMiddleware, roleAuth([Role.USER, Role.PUBLISHER]), async (req, res) => {
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
        start_date: start_date ? new Date(start_date) : new Date(),
        end_date: end_date ? new Date(end_date) : new Date(),
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

router.patch("/updateProjectApproved/:fid/:pid", authMiddleware, roleAuth([Role.USER, Role.PUBLISHER]), async (req, res) => {
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
        start_date: new Date(start_date),
        end_date: new Date(end_date),
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

router.delete("/deleteForm/:fid", authMiddleware, roleAuth([Role.USER, Role.PUBLISHER]), async (req, res) => {
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

router.post('/createRequestApproved', authMiddleware, roleAuth([Role.USER, Role.PUBLISHER]), async (req, res) => {
    let { body, user } = req
    let { form_info: formBody, request_info: requestInfoBody, sub_activity } = body
    let { form_no, institution, solution, contact, form_type } = formBody
    let formInfoBody = {
        form_no: form_no,
        institution: institution,
        solution: solution,
        created_date: new Date(),
        contact: contact,
        Tel: null,
        form_type: form_type,
    }

    let { project_name, project_due_to, start_date, end_date, location, cost, cost_des_th } = requestInfoBody
    let requestInfo = {
        project_name: project_name,
        project_due_to: project_due_to,
        start_date: start_date ? new Date(start_date) : new Date(),
        end_date: end_date ? new Date(end_date) : new Date(),
        location: location,
        cost: cost,
        cost_des_th: cost_des_th,
        user_id: user.user_id
    }

    let result
    try {
        let formInfoBodyResponse = await form_info.create({
            data: formInfoBody
        })
        requestInfo.form_info_id = formInfoBodyResponse.form_info_id
        let requestInfoResponse = await request_info.create({
            data: requestInfo
        })
        let requestApproveBody = sub_activity.map((item) => {
            return {
                request_info_id: requestInfoResponse.request_info_id,
                sub_activity_id: item.sub_activity_id,
                activity_hour: item.activity_hour,
            }
        })
        await request_approved.createMany({
            data: requestApproveBody
        })
        result = await request_approved.findMany({
            where: {
                request_info_id: requestInfoResponse.request_info_id
            },
            select: {
                activity_hour: true,
                sub_activity_id: true,
                request_info: {
                    select: {
                        form_info: {
                            select: { form_info_id: true }
                        },
                        request_info_id: true
                    }
                }
            }
        })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

router.patch("/updateRequestApproved/:fid/:rid", authMiddleware, roleAuth([Role.USER, Role.PUBLISHER]), async (req, res) => {
    let { body, user } = req
    let { form_info: formBody, request_info: requestInfoBody, sub_activity } = body
    let { form_no, institution, solution, contact, form_type } = formBody
    let formInfoBody = {
        form_no: form_no,
        institution: institution,
        solution: solution,
        contact: contact,
        Tel: null,
        form_type: form_type,
    }

    let { project_name, project_due_to, start_date, end_date, location, cost, cost_des_th } = requestInfoBody
    let requestInfo = {
        project_name: project_name,
        project_due_to: project_due_to,
        start_date: start_date ? new Date(start_date) : new Date(),
        end_date: end_date ? new Date(end_date) : new Date(),
        location: location,
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
        await request_info.update({
            where: {
                request_info_id: req.params.rid
            },
            data: requestInfo
        })
        let requestApproveBody = sub_activity.map((item) => {
            return {
                request_info_id: req.params.rid,
                sub_activity_id: item.sub_activity_id,
                activity_hour: item.activity_hour,
            }
        })
        await request_approved.deleteMany({
            where: {
                request_info_id: req.params.rid
            }
        })
        result = await request_approved.createMany({
            data: requestApproveBody
        })
    }
    catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ error: error.message })
    }
    return res.send({ data: result })
})

module.exports = router