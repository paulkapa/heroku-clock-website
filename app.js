const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.listen(PORT, console.log(`Listening on port ${PORT}...`));
