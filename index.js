const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { Timestamp } = require("bson");
const app = express();
const PORT = 3000;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("Mongodb connected"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        }, 
        {
        $push: {
            visitHistory: {
                Timestamp: Date.now()
            },
        }
    });
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at Port:${PORT}`));
