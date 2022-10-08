const router = require('express').Router()
const { Prisma } = require("../constant/prisma")
const { Role } = require("../constant/roleId")
const roleAuth = require("../middlewares/role.middleware")
const authMiddleware = require('../middlewares/auth.middleware')
const dayjs = require("dayjs")
const { voting_results } = Prisma

BigInt.prototype["toJSON"] = function () {
    return this.toString();
}

router.get('/getVoteResult', async (req, res) => {
    let { year } = req.query
    let results = await Prisma.$queryRaw`SELECT * FROM voting_results WHERE substring(vote_date,1,4) = ${year}`
    return res.send({ data: results })
})

router.get('/getSumVoteResult', async (req, res) => {
    let { year } = req.query
    let results = await Prisma.$queryRaw`SELECT COUNT(vote_result_id) as vote, vote_result FROM voting_results WHERE substring(vote_date,1,4) = ${year} GROUP BY vote_result`
    return res.send({ data: results })
})

router.get('/getAllResult', async (req, res) => {
    let { year } = req.query
    let results = await Prisma.$queryRaw`SELECT COUNT(vote_result_id) as Result FROM voting_results WHERE substring(vote_date,1,4) = ${year} `
    return res.send({ data: results })
})

router.post('/createVoteResult', authMiddleware, roleAuth([Role.USER]), async (req, res) => {
    let { user } = req
    let { vote_result } = req.body
    let dateNow = dayjs()
    let year = dateNow.year()
    let exists = await Prisma.$queryRaw`SELECT * FROM voting_results WHERE substring(vote_date,1,4) = ${year} AND user_id = ${user.user_id}`

    if (exists.length > 0) {
        return res.status(400).send({ error: "You have already voted", date: dateNow.toDate() })
    }
    let result = await voting_results.create({
        data: {
            user_id: user.user_id,
            vote_result: vote_result,
            vote_date: dateNow.toDate()
        }
    })
    return res.send({ data: result })
})

router.delete('/deleteVoteResultByYear', authMiddleware, roleAuth([Role.PUBLISHER]), async (req, res) => {
    let { year } = req.query
    try {
        await Prisma.$queryRaw`DELETE FROM voting_results WHERE substring(vote_date,1,4) = ${year}`
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
    return res.send({ data: "DELETE SUCCESSFULLY" })
})

module.exports = router