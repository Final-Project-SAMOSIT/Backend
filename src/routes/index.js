const router = require('express').Router()
const authController = require('./auth.controller')

router.use(authController)

router.get("/",(req,res)=>{
    return res.send({api:"SAMOSIT"})
})

router.get("/health",(req,res)=>{
    return res.send({status:"healthy"})
})

// export router
module.exports = router