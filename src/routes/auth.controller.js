const { authService } = require('../services/auth.service')
const authMiddleware = require('../middlewares/auth.middleware')
const { PrismaClient } = require('@prisma/client')
const router = require('express').Router()
const {user_details:users} = new PrismaClient()

router.get("/auth/redirect", async (req, res) => {
    let { code } = req.query
    let result
    try {
        result = await authService.handleRedirect(code)
    } catch (error) {
        return res.status(400).send({ msg: error.message })
    }
    return res.send({ userDetail: result })
})

router.get("/auth/check",authMiddleware, async(req,res)=>{
    let { user_id, user_type, name_th, name_en, email } = req.user
    let userInDB = await users.findUnique({where:{user_id:user_id}})
    try {
        if(!userInDB){
        await users.create({data:{user_id:user_id,user_type:user_type,name_th:name_th,name_en:name_en,email:email,role_id:'3'}})
    }else{
        await users.update({where:{user_id:user_id},data:{user_type:user_type,name_th:name_th,name_en:name_en,email:email}})
        // return res.status(200).send("Update success")
    }
    } catch (error) {
        return res.status(400).send({ msg: error.message })
    }
    // if (req.user == undefined)
    return res.status(200).send({userDetail: req.user})
})

module.exports = router