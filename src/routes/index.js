const router = require('express').Router()

router.get("/",(req,res)=>{
    return res.send({api:"SAMOSIT"})
})

router.get("/health",(req,res)=>{
    return res.send({status:"healthy"})
})

// export router
module.exports = router