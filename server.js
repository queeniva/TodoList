const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js")

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })

const itemSchema = {
    name: String
}

const Item = mongoose.model("Item", itemSchema);
const buy = new Item({
    name: "buy bread"
})
const cook = new Item({
    name: "cook beans"
});
const sell = new Item({
    name: "sell umbrella"
});

const defaultArray = [buy, cook, sell]

app.get("/", function (req, res) {
    let day = date.getDate();
    Item.find({}, function (err, item) {
        if (item.length === 0) {
            Item.insertMany(defaultArray, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("success")
                }
            });
        } else {
            res.render("list", { listTitle: day, newListItem: item });
        }
    });
});

app.post("/", (req, res) => {
    var newItem = req.body.newItem;

    const item = new Item({
        name: newItem
    });
    item.save();
    if (req.body.list === "work") {
        workItem.push(newItem)
        res.redirect("/work")
    } else {
        defaultArray.push(newItem)
        res.redirect("/")
    }
});

app.post("/delete", (req,res)=>{
    const checkedItemId = req.body.checkbox ;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("success")
            res.redirect("/")
        }
    })
});

app.get("/work", function (req, res) {
    let day = date.getDate();
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

