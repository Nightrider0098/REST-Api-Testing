const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const serialiser = require('node-serialize');
// const { entries } = require('../inputStubs');
const should = chai.should();
const server = require('../server')
const websiteURL = 'localhost:5400'

var requester = chai.request(server).keepOpen()

describe("Initial Tests.", () => {
    it('websiteURL should be hosted on port 5400.', done => {
        requester.get("/").end((err, res) => {
            if (err) console.log(err)
            if (res.status === 404)
                done()
            else {
                expect(false).to.be(true)
            }
        })

    })

    it("get request should return details about one student when id is specified.", done => {
        requester.get("/api/student/1").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object')
            expect(res.body.id).to.equal(1)
            done();
        })
    })

    it("websiteURL should have details about two dummy records.", () => {
       requester.get("/api/student/1").end((err, res) => {
            expect(res.status).to.eq(200);
            expect(res.body.id).to.equal(1)

        })

       requester.get("/api/student/2").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object')
            chai.expect(res.body.id).to.equal(2)

        })

    })


})

describe('Id Validation Check.', () => {
    it("If id's syntax is correct but does not exist server should return statusCode 404 for all request.", () => {
       requester.get('/api/student/4').end((err, res) => {
            expect(err).to.eq(null)
            console.log(res.body)
            expect(res.status).to.equal(404)
        })

       requester.put('/api/student/4').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Lokesh' }).end((err, res) => {
            expect(err).to.eq(null)
            expect(res.status).to.equal(404)
        })
       requester.delete('/api/student/4').end((err, res) => {
            expect(err).to.eq(null)
            expect(res.status).to.equal(404)
        })

    })

    it('If syntax of id is wrong while using delete request server should return status code 400.', () => {

       requester.get('/api/student/adx').end((err, res) => {
            expect(res.status).to.equal(400)
        })

       requester.put('/api/student/Dsv').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Lokesh' }).end((err, res) => {
            expect(res.status).to.equal(400)
        })
       requester.delete('/api/student/dsv').end((err, res) => {
            expect(res.status).to.equal(400)
        })

    })

})
