require("dotenv").config()
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const pet = new PrismaClient().petition

router.get("/getPetition", async(req,res)=>{
    let test = await pet.findMany({
        include:{
            status: true,
            pet_types: true
        }
    })
    if (test == undefined || test.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: test })
})

router.post("/addPetition",authMiddleware , async(req,res) => {
    try {
        let { pet_topic,pet_details,type_id } = req.body 
        let {user_id} = req.user
        let userTotal = await pet.findMany({
            where: {
                user_id: user_id,
                status_id: "1"
            }
        })

        if (userTotal.length >= 5){
            return res.status(500).send({ msg: "Can't add petitions more than 5 times in sent status" })
        } 

        let result = await pet.create({
            data:{
                pet_topic: pet_topic,
                pet_details: pet_details,
                pet_date: dayjs().toDate(),
                user_id: user_id,
                type_id: type_id,
                status_id: "1"
            }
        })

        return res.send({ msg: "Successfully", data: result })
    } catch (error) {
        return res.status(400).send({ status: "Don't have any data", message: error.message })
    }
})

router.put("/editStatusPet/:id", async(req,res) => {
    try {
        let petId = String(req.params.id)
        let { status_id } = req.body
        let updateStatus = await pet.update({
            where: {
                pet_id: petId
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

router.delete("/deletePet/:id", async(req,res)=>{
    try {
        let petId = String(req.params.id)
        let result = await pet.delete({
            where: {
                pet_id: petId
            }
        })

        if(!result){
            return res.send({ status: "Can't find this petition" })
        }
        return res.send({ status: "Delete Successful" })

    } catch (error) {
        return res.status(400).send({ status: "Can't delete", message: error.message })
    }
})

module.exports = router