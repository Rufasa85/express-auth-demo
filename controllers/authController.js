const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");


router.get("/secretclub", function (req, res) {
    if (req.session.user) {
        res.render("secretclub", req.session.user)
    } else {
        res.redirect("/login");
    }
})

router.get("/signup", function (req, res) {
    res.render("signup");
})

router.post("/signup", function (req, res) {
    db.User.create({
        username: req.body.username,
        password: req.body.password
    }).then(newUser => {
        // res.json(newUser)
        req.session.user = {
            username: newUser.username,
            id: newUser.id
        };
        // res.send("logged in!")
        res.redirect('/secretclub')
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", function (req, res) {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(dbUser => {
        if (bcrypt.compareSync(req.body.password, dbUser.password)) {
            req.session.user = {
                username: dbUser.username,
                id: dbUser.id
            };
            // res.send("logged in!")
            res.redirect('/secretclub')
        } else {
            res.send("not logged in")
        }
    })
})

router.get("/readsessions", function (req, res) {
    res.json(req.session);
})

router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.json('logged out');
    })
})

module.exports = router;