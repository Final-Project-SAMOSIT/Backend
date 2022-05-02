const { authService } = require('../services/auth.service')
const authMiddleware = require('../middlewares/auth.middleware')
const router = require('express').Router()

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

router.get("/auth/me",authMiddleware, async(req,res)=>{
    return res.status(200).send({userDetail: req.user})
})

module.exports = router