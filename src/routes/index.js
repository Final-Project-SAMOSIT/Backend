const router = require('express').Router()
const authController = require('./auth.controller')
const petition = require('./petition')

router.use(authController)
router.use(petition)

router.get("/",(req,res)=>{
    return res.send({api:"SAMOSIT"})
})

router.get("/health",(req,res)=>{
    return res.send({status:"healthy"})
})

// export router
module.exports = router