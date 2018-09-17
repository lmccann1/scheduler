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
            conn.query('SELECT * FROM roominfo where `Capacity` >= (SELECT COUNT(*) as count FROM consultants where `GroupInfo_G_id` = ?)',GID, function(err, rows){
                if(err != null) reject(err);
                console.log(rows);
                resolve(rows);
            });
        });
    },
    async isAvailable(ID, COLUMN, DATE, ){
        let columns = {
            room: 'RoomInfo_R_id',
            trainer: 'TrainerInfo_T_id'
        }
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM schedule where ?? = ? AND `Date` = ?', [columns[COLUMN], ID, DATE], function (err, rows) {
                if(err != null) reject(err);
                console.log(rows);
                if(rows.length === 0){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            });
        });
    },
};