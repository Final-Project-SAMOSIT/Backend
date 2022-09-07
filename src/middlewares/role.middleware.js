const { Prisma } = require("../constant/prisma")
const { user_details } = Prisma

module.exports = function (allowedRoles) {
    return async function (req, res, next) {
        let { user } = req
        let userInDB = await user_details.findFirst({
            where: {
                user_id: user.user_id
            },
            include: {
                roles: true
            }
        })

        const isAllowed = role => allowedRoles.indexOf(role) > -1
        if (req.user && userInDB.role_id && isAllowed(userInDB.role_id)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    }
}