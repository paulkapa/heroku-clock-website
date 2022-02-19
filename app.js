const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(`${__dirname}/views`));
app.set(`views`, `${__dirname}/views`);

app.get("/", (req, res) => {
    res.sendFile(`index.html`);
    console.log("GET /");
});

app.listen(PORT, console.log(`Listening on port ${PORT}...`));
