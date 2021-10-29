const express = require("express");
const bodyParser = require('body-parser')

const app = express();
const port = 5000;
let error = [];

app.set("view engine", "pug");
app.use(express.urlencoded());
app.use(bodyParser());


// SAMPLE DATA TO WORK WITH
const data = [
    { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
    { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
    { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
    { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
    { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" },
]

// INITAL GET REQUEST FOR PAYER AND POINTS AND TO LOAD LANDING PAGE
app.get("/", (req, res) => {
    let filterData = []
    data.forEach((entry) => filterData.push({ 'payer': entry.payer, 'points': entry.points }))
    console.log("Current Payer and Points", filterData)
    res.render('index', { filterData });
});

// LOADS ADD PAYER
app.get('/add-payer', (req, res) => {
    res.render("addPayer", { error })
})
// ON SUMBIT A POST REQUEST IS SENT ADDING THE NEW PAYER BEFORE REDIRECTING TO HOME PAGE
app.post('/add-payer', (req, res) => {
    error = []

    // FORM DATA RETRIEVED HERE
    const { payer, points } = req.body

    // FORM VALIDATION TO INSURE ALL INFORMATION NECESSARY IS RECEIVED
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

// LOADS POINT SPENDER PAGE
app.get('/spend-points', (req, res) => {
    res.render("spendPoints", { error })
})

// RETURNS THE PAYER'S TOTAL POINTS AFTER USE AND UPDATES HOME PAGE
app.post('/spend-points', (req, res) => {
    error = []

    const points = req.body.points

    if (!points) {
        error.push('Please provide points')
    }

    let sortTimes = []
    for (const key in data) {
        sortTimes.push([key, data[key].timestamp])
    }

    // SORTING OUR DATA BY ITS TIMESTAMP
    sortTimes.sort((a, b) => new Date(a[1]) - new Date(b[1]))

    let pointTally = points
    let fallingPoints = []

    // LOOPING OVER SORTTIMES TO GET AND REMOVE POINTS FROM PAYERS
    for (let i = 0; i < sortTimes.length; i++) {
        if (data[i].points < 0) { continue }
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
