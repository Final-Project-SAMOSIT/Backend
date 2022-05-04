const { default: axios } = require("axios")

module.exports = async function(req,res,next){
    console.log(req.headers)
    const bearerAccessToken = req.headers.authorization
    if (!bearerAccessToken) {
      return res.status(401).send({msg:"No bearer access token was provided"})
    }
    const accessToken = bearerAccessToken.split(" ")[1]
    if (!accessToken) {
      return res.status(401).send({msg:"Please send token in format: Bearer <token>"})
    }
    let user
    try {
        user = await axios.get(`https://gatewayservice.sit.kmutt.ac.th/api/me`,{
        headers: {
            Authorization: bearerAccessToken
        }
    })
    } catch (error) {
        return res.status(400).send({ msg: error.message })
    }
    
    user = user.data
    req.user = user
    next()
}