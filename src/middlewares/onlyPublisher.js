const { Role } = require("../constant/roleId")

module.exports = function (req, res, next) {
    let { user } = req
    if (user.roles[0].role_id != Role.PUBLISHER) {
        return res.status(401).send({ msg: "USER OR ADMIN not Authorization" })
    }
}