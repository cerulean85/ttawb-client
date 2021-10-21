const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        proxy("/api", {
            tartget: "http://218.150.182.180:3002/"
        })
    );
};