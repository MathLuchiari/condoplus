'use strict';

module.exports = function(app) {
    app.route('/')
        .get( (req, res) => {
            res.render("login", {
                page_title: 'login',
                layout: 'login'
            })
        })
}