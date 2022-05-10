const router = require('express').Router()
const authController = require('./auth.controller')
const petitionType = require('./petitionType')
const petitionStatus = require('./petitionStatus')

router.use(authController)
router.use(petitionType)
router.use(petitionStatus)

router.get("/",(req,res)=>{
    return res.send({api:"SAMOSIT"})
})

router.get("/health",(req,res)=>{
    return res.send({status:"healthy"})
})

// export router
module.exports = router