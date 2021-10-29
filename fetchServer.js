const express = require("express");
const bodyParser = require('body-parser')

const app = express();
const port = 5000;
let error = [];

app.set("view engine", "pug");
app.use(express.urlencoded());
app.use(bodyParser());

const data = [
    { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
    { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
    { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
    { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
    { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" },
]


app.get("/", (req, res) => {
    let filterData = []
    data.forEach((entry) => filterData.push({ 'payer': entry.payer, 'points': entry.points }))
    console.log("Current Payer and Points", filterData)
    res.render('index', { filterData });
});

app.get('/add-payer', (req, res) => {
    res.render("addPayer", { error })
})

app.post('/add-payer', (req, res) => {
    error = []
    const { payer, points } = req.body

    if (!payer) {
        error.push('Please provide a Payer')
    }
    if (!points) {
        error.push('Please provide points')
    }

    const newPayer = {
        payer,
        "points": Number(points),
        "timestamp": new Date().toISOString()
    };

    if (error.length > 0) {
        res.redirect('/add-payer', 400, (req, res) => {
            res.render("addPayer", {
                error,
            })
        })
        return;
    }
    data.push(newPayer);
    res.redirect("/");
})


app.get('/spend-points', (req, res) => {
    res.render("spendPoints", { error })
})


app.post('/spend-points', (req, res) => {
    error = []
    console.log("We are in here", req.body)
    const points = req.body.points

    if (!points) {
        error.push('Please provide points')
    }

    let sortTimes = []
    for (const key in data) {
        sortTimes.push([key, data[key].timestamp])
    }
    sortTimes.sort((a, b) => new Date(a[1]) - new Date(b[1]))
    let pointTally = points
    let fallingPoints = []
    console.log(sortTimes)
    for (let i = 0; i < sortTimes.length; i++) {
        if (data[i].points < 0) { continue }
        console.log(pointTally)
        if (data[i].points > pointTally) {
            data[i].points = data[i].points - pointTally;
            fallingPoints.push({ "payer": data[i].payer, "points": 0 - pointTally })
            break;
        }
        fallingPoints.push({ "payer": data[i].payer, "points": 0 - data[i].points })
        pointTally -= data[i].points
        data[i].points = 0;
    }

    if (error.length > 0) {
        res.redirect('/spendPoints', 400, (req, res) => {
            res.render("spendPoints", {
                error,
            })
        })
        return;
    }
    console.log("Payers Point Subraction", fallingPoints)
    res.redirect("/");
})




app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;
