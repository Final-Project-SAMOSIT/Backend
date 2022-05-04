const { default: axios } = require("axios")

exports.authService = {
    async handleRedirect(receiveCode) {
        const clientSecret = process.env.CLIENT_SECRET
        const clientId = process.env.CLIENT_ID
        const redirectURI = process.env.REDIRECT_URI
        if (!clientSecret) {
            throw new Error("require client secret in BE env")
        }
        let user = await axios.get(`https://gatewayservice.sit.kmutt.ac.th/api/oauth/token?client_secret=${clientSecret}&client_id=${clientId}&code=${receiveCode}&redirect_uri=${redirectURI}`)
        user = user.data
        return user;
    }
}