const express = require('express')
const app = express();
const port = 5400;
const bodyParser = require('body-parser')

var studentArray = require('./inputStubs')

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/student/:id', (req, res) => {

    let id = req.params.id;
    if (!isNaN(id)) {
        id = parseInt(id)
        let studentObject = studentArray.find((e) => { return (e.id === id) })
        if (studentObject === undefined || studentObject === {}) {
            return res.sendStatus(404)
        }
        else {
            return res.json(studentObject)
        }
    }
    else {
        return res.sendStatus(400)
    }
})


app.post('/api/student', (req, res) => {
    let reqKeys = Object.keys(req.body);
    if (reqKeys.find((e) => { return e === 'name' }) && reqKeys.find((e) => { return e === 'currentClass' }) && reqKeys.find((e) => { return e === 'division' })) {

        if (!isNaN(req.body.currentClass)) {
            let name = req.body.name;
            let currentClass = req.body.currentClass;
            let division = req.body.division;
            let idList = studentArray.map((e) => { return e.id })
            let id = Math.max(...idList) + 1;
            // console.log('executed')
            studentArray.push({ id: id, name: name, currentClass: parseInt(currentClass), division: division })
            return res.json({ id: id })
        }
        else {

            return res.sendStatus(400)
        }
    }
    else {
        // console.log('failed here',reqKeys)
        return res.sendStatus(400)
    }

})

app.put('/api/student/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        let id = parseInt(req.params.id);
        let studentObjectOld = studentArray.find((e) => { return (e.id === id) })
        if (studentObjectOld === undefined) {
            return res.sendStatus(404)
        }
        else {
            let updateObject = req.body;
            if (Object.keys(updateObject).find((e) => { return e === 'currentClass' })) {
                if (!isNaN(updateObject.currentClass)) {
                    updateObject.currentClass = parseInt(updateObject.currentClass)
                }
                else {
                    return res.sendStatus(400)
                }
            }
            let studentObjectNew = { ...studentObjectOld, ...updateObject }
            ////console.log(studentObjectNew)
            let index = studentArray.indexOf(studentObjectOld);
            studentArray.splice(index, 1);
            studentArray.push(studentObjectNew)
            res.sendStatus(200);
        }
    }
    else {
        return res.sendStatus(400)
    }
})

app.delete('/api/student/:id', (req, res) => {
    let id = req.params.id;
    if (!isNaN(id)) {
        id = parseInt(id)
        let studentObject = studentArray.find((e) => { return e.id === id })
        if (studentObject !== undefined) {
            let index = studentArray.indexOf(studentObject);
            studentArray.splice(index, 1);
            return res.sendStatus(200)
        }
        else {
            return res.sendStatus(404)
        }
    }
    else {
        return res.sendStatus(400)
    }

})


app.get('/all', (req, res) => {
    res.json(studentArray)
})

app.use('*', (req, res) => {
    res.sendStatus(404);
})
app.listen(port, (err) => {
    if (!err) { console.log('magic happen on port ', +port); }
    else { console.log('failed to launch the server through port ' + port, err); }
})


module.exports = app;
