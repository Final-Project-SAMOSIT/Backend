require("dotenv").config()
const router = require('express').Router()
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const { Role } = require("../constant/roleId")
const { Prisma } = require("../constant/prisma")
const { petition } = Prisma
const prismaErrorHandling = require("../services/prismaErrorHandler")
const { PETTITION_STATUS } = require("../constant/pettitionStatus")

router.get("/getPetition", async (req, res) => {
    try {
        let test = await petition.findMany({
            include: {
                status: true,
                petition_types: true
            },
            orderBy: {
                petition_date: "asc"
            }
        })
        if (test == undefined || test.length < 0) {
            return res.status(204).send({ status: "Don't have any data" })
        }

        return res.send({ data: test })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }

})

router.get("/getPetition/:userId", async (req, res) => {
    try {
        let { userId: userId } = req.params
        let result = await petition.findMany({
            where: {
                user_id: userId
            },
            include: {
                petition_types: true,
                status: true
            },
            orderBy: {
                petition_date: "desc"
            }
        })

        if (result == undefined || result.length < 0) {
            return res.status(204).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })

    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }
})

router.post("/addPetition", authMiddleware, async (req, res) => {
    try {
        let { petition_topic, petition_details, petition_type_id,petition_img } = req.body
        let { user_id } = req.user
        let petitionCount = await petition.findMany({
            where: {
                user_id: user_id,
                status_id: PETTITION_STATUS.SENT
            }
        })

        if (petitionCount.length >= 5) {
            return res.status(500).send({ msg: "Can't add petitions more than 5 times in sent status" })
        }

        let result = await petition.create({
            data: {
                petition_topic: petition_topic,
                petition_details: petition_details,
                petition_date: dayjs().toDate(),
                user_id: user_id,
                petition_type_id: petition_type_id,
                status_id: PETTITION_STATUS.SENT,
                petition_img: petition_img
            }
        })

        return res.send({ msg: "Successfully", data: result })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }
})

router.put("/editStatusPetition/:id", async (req, res) => {
    try {
        let { id: petition_id } = req.params
        let { status } = req.body
        let status_id = ""
        switch (status) {
            case "Sent":
                status_id = PETTITION_STATUS.SENT
                break;
            case "Approve":
                status_id = PETTITION_STATUS.APPROVE
                break;
            case "In Progress":
                status_id = PETTITION_STATUS.IN_PROGRESS
                break;
            case "Done":
                status_id = PETTITION_STATUS.DONE
                break;
            case "Reject":
                status_id = PETTITION_STATUS.REJECT
                break;
            default:
                throw new Error("Cannot set this status")
        }

        let updateStatus = await petition.update({
            where: {
                petition_id: petition_id
            },
            data: {
                status_id: status_id
            }
        })

        return res.send({ status: `Update sucessfully`, data: updateStatus })
    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ status: "Can't update", message: error.message })
    }
})

router.delete("/deletePetition/:id", async (req, res) => {
    try {
        let { id: petition_id } = req.params
        let result = await petition.delete({
            where: {
                petition_id: petition_id
            }
        })

        if (!result) {
            return res.send({ status: "Can't find this petition" })
        }
        return res.send({ status: "Delete Successful" })

    } catch (error) {
        prismaErrorHandling(error, null, res)
        return res.status(400).send({ status: "Can't delete", message: error.message })
    }
})

module.exports = router