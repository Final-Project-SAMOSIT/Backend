require("dotenv").config()
const router = require('express').Router()
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const { Role } = require("../constant/roleId")
const { Prisma } = require("../constant/prisma")
const { petition } = Prisma

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
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }
})

router.post("/addPetition", authMiddleware, async (req, res) => {
    try {
        let { petition_topic, petition_details, petition_type_id } = req.body
        let { user_id } = req.user
        let userTotal = await petition.findMany({
            where: {
                user_id: user_id,
                status_id: Role.ADMIN
            }
        })

        if (userTotal.length >= 5) {
            return res.status(403).send({ msg: "Can't add petitions more than 5 times in sent status" })
        }

        let result = await petition.create({
            data: {
                petition_topic: petition_topic,
                petition_details: petition_details,
                petition_date: dayjs().add(7, 'hour').toDate(),
                user_id: user_id,
                petition_type_id: petition_type_id,
                status_id: "1"
            }
        })

        return res.send({ msg: "Successfully", data: result })
    } catch (error) {
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
                status_id = "1"
                break;
            case "Approve":
                status_id = "2"
                break;
            case "In Progress":
                status_id = "3"
                break;
            case "Done":
                status_id = "4"
                break;
            case "Reject":
                status_id = "5"
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
        return res.status(400).send({ status: "Can't delete", message: error.message })
    }
})

module.exports = router