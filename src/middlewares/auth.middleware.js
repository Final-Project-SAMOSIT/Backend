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
    try {
        let user = await axios.get(`https://gatewayservice.sit.kmutt.ac.th/api/me`,{
        headers: {
            Authorization: bearerAccessToken
        }
    })
    } catch (error) {
        throw new Error("require client secret in BE env")
    }
    
    user = user.data
    req.user = user
    next()
}