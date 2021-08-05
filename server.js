const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const date = require(__dirname + "/date.js")

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
const empty = "pls input a todoItem"

// var qs = require("querystring");
// var http = require("https");

// var options = {
//     "method": "GET",
//     "hostname": "quotes15.p.rapidapi.com",
//     "path": "https://quotes15.p.rapidapi.com/quotes/random/",
//     "headers": {
//         "x-rapidapi-key": "f11e519a9bmsh6d3c29dc4f5e985p1ce466jsnc6545e774d22",
//     }
// };

// var req = http.request(options, function (res) {
//     var chunks = [];

//     res.on("data", function (chunk) {
//         chunks.push(chunk);
//     });

//     res.on("end", function () {
//         var body = Buffer.concat(chunks);
//         var result = JSON.parse(body);
//         console.log(result.content+result.originator.name);

//     });
// });

// req.write(qs.stringify({}));
// req.end();

mongoose.connect("mongodb+srv://Admin_Queen:nguqueen1234@cluster0.nhk9p.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const itemSchema = {
    name: {
        type: String,
        require: true
    }
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

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

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

app.post("/", function (req, res) {
    const newItem = req.body.newItem;
    const listName = req.body.list;
    let day = date.getDate();
    const item = new Item({
        name: newItem
    });
    if (listName === day) {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            if (err) {
                console.log(err)
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName)
            }

        })
    }
});

// deleting todoItems from the list
app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listNam;
    let day = date.getDate();
    if (listName === day) {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("success")
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, result) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })

    }
});

// creating custom links using input from users
app.get("/:customLink", function (req, res) {
    const customLink = _.capitalize(req.params.customLink);
    List.findOne({ name: customLink }, function (err, result) {
        if (!err) {
            if (!result) {
                const list = new List({
                    name: customLink,
                    list: defaultArray
                })
                list.save()
                res.redirect("/" + customLink)
            } else {
                res.render("list", { listTitle: result.name, newListItem: result.items })
            }
        }
    })
})

app.get("/about", function (req, res) {
    res.render("about")
});

app.post("/work", (req, res) => {
    var newItem = req.body.newItem;
    items.push(newItem)
    res.redirect("/work")
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log('server runing in port 3000');
})

