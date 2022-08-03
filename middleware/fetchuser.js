const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
    // get the user from jwt token and add id to request object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate with valid user credentials" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate with valid user credentials" });
    }
}

module.exports = fetchuser;