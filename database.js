const pmysql = require('promise-mysql');

pmysql.createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "",
    database: "proj2022"
})
    .then(p => {
        pool = p;
    })
    .catch(e => {
        console.log("pool error: " + e)
    })

module.exports = {
    getEmployees: function () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM employee')
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    editEmployee: function (eid) {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM employee WHERE eid like(\"${eid}\")`)
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })

    }
}

