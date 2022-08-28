const { Prisma } = require("../constant/prisma")
const { Role } = require("../constant/roleId")
const { user_details } = Prisma

module.exports = async function (req, res, next) {
    let { user } = req
    let userInDB = await user_details.findFirst({
        where: {
            user_id: user.user_id
        },
        include: {
            roles: true
        }
    })
    if (userInDB.role_id != Role.PUBLISHER) {
        return res.status(401).send({ msg: "USER OR ADMIN not Authorization" })
    }
    next()
}