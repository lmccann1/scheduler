var mysql = require('mysql');

var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'scheduler',
})

conn.connect();

module.exports = {
    async getAllFromTable(table) {
        return new Promise((resolve, reject) => {

            conn.query('SELECT * FROM ??', table, function(err, rows){
                if(err != null) reject(err);
                resolve(rows);

            });

        })
    },
    async getNumOfConsultants(GID){
        return new Promise((resolve, reject) => {
            conn.query('SELECT COUNT(*) as count FROM consultants where `GroupInfo_G_id` = ?', GID, function (err, rows) {
                if(err != null) reject(err);
                resolve(rows[0].count);

            });
        })

    },
    async getTrainersWithSkill(SID) {
        return new Promise((resolve, reject) => {
            conn.query('SELECT T_id from trainerskills where `Skill_id` = ?', SID, function (err, rows) {
                if (err != null) reject(err);
                resolve(rows);
            });
        });
    },
    async checkCapacity(GID){
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM roominfo where `Capacity` >= (SELECT COUNT(*) as count FROM consultants where `GroupInfo_G_id` = ? ) ORDER BY Capacity',GID, function(err, rows){
                if(err != null) reject(err);
                console.log(rows);
                resolve(rows);
            });
        });
    },
    async isAvailable(ID, COLUMN, DATE, ){
        return new Promise((resolve, reject) => {
            let columns = {
                room: 'RoomInfo_R_id',
                trainer: 'TrainerInfo_T_id'
            };
            conn.query('SELECT * FROM schedule where ?? = ? AND `Date` = ?', [columns[COLUMN], ID, DATE], function (err, rows) {
                if(err != null) reject(err);
                console.log("IS AVAILABLE " + COLUMN);
                console.log(rows);
                console.log("----------------");
                if(rows.length === 0){
                    console.log("Here");
                    resolve(true);
                }
                else{
                    console.log("there");
                    resolve(false);
                }
            });
        });
    },
    async addToSchedule(TID, RID, GID, DATE){
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO schedule VALUES(null, ?,?,?,?)', [DATE, RID, TID, GID], function(err, result) {
                if (err) throw err;
                console.log(result);

            });
        });
    },
    async scheduleTable(){
        return new Promise((resolve, reject ) => {
            conn.query('SELECT * FROM schedule inner join trainerinfo on schedule.TrainerInfo_T_id = trainerinfo.T_id inner join  groupinfo g on schedule.GroupInfo_G_id = g.G_id inner join roominfo r on schedule.RoomInfo_R_id = r.R_id', function(err,rows){
                if (err) throw err;
                console.log(rows);
            });
        });

    }
};