var express = require('express');
var router = express.Router();

var sqlcontroller = require('../services/sqlcontroller');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let groups = await sqlcontroller.getAllFromTable('groupinfo');
    let skills = await sqlcontroller.getAllFromTable('skills');
    console.log(groups);
    res.render('index', {
        title: 'SCHEDULER',
        groups: groups,
        skills: skills
    });
});


module.exports = router;
