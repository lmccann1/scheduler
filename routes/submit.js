var express = require('express');
var router = express.Router();
var sqlcontroller = require('../services/sqlcontroller');

router.post('/', async function(req, res){

    var trainers = await sqlcontroller.getTrainersWithSkill(req.body.skill);
    var rooms = await sqlcontroller.checkCapacity(req.body.group);


    var availableTrainer;
    var availableRoom;

    var findAvailables = async function () {

        for(i=0; i<trainers.length; i++) {
            if(await sqlcontroller.isAvailable(trainers[i].T_id, "trainer", req.body.date)) {
                availableTrainer = trainers[i].T_id;
                break;
            }
        }
        for(i=0; i<rooms.length; i++){
            if(await sqlcontroller.isAvailable(rooms[i].R_id, "room", req.body.date)){
                availableRoom = (rooms[i].R_id);
                break;
            }
        }

    };

    await findAvailables();

    if(!availableTrainer || !availableRoom){
        res.send("Can not find a solution!");
    }
    else {
        sqlcontroller.addToSchedule(availableTrainer, availableRoom, req.body.group, req.body.date)
        res.send("success");
    }
});

module.exports = router;