const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js")

const app = express();

var items = [];
var workItem = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));


app.get("/", function (req, res) {
    let day = date.getDate();
    res.render("list", { listTitle: day, newListItem: items });
});

app.post("/", (req, res) => {
    var newItem = req.body.newItem;
    if (req.body.list === "work") {
        workItem.push(newItem)
        res.redirect("/work")
    } else {
        items.push(newItem)
        res.redirect("/")
    }
});

app.get("/work", function (req, res) {

    res.render("list", { listTitle: day, newListItem: workItem });
});

app.get("/about", function (req, res) {
    res.render("about")
});

app.post("/work", (req, res) => {
    var newItem = req.body.newItem;
    items.push(newItem)
    res.redirect("/work")
});



app.listen(3000, function () {
    console.log('server runing in port 3000');
})