const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const serialiser = require('node-serialize');
// const { entries } = require('../inputStubs');
const should = chai.should();
var server = require('../../server');
var websiteURL = 'localhost:5400'

//TestCases invloving changing the internal StudentArray
describe("Insersion Tests.", () => {

    it('Automatic incrementation of id when new student id is added.', () => {
        chai.request(websiteURL).post('/api/student').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Kacha', currentClass: 12, division: 'A' }).end((err, res) => {
            expect(res.status).to.equal(200)
            chai.request(websiteURL).get('/api/student/3').end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.name).to.eq('Kacha')
            })
            chai.request(websiteURL).post('/api/student').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Rohan', currentClass: 9, division: 'A' }).end((err, res) => {
                expect(res.status).to.equal(200)
                chai.request(websiteURL).get('/api/student/4').end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.name).to.eq('Rohan')
                })
            })
        })
    })

    it('currentClass variable should be a integer.', () => {
        chai.request(websiteURL).get('/api/student/3').end((err, res) => {
            expect(res.status).to.equal(200)
            expect(typeof (res.body.currentClass)).to.eq(typeof (1))
        })
    })
    
    it('Valid post request should return status code 200.', () => {
        chai.request(websiteURL).keepOpen().post('/api/student').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Kacha', currentClass: 12, division: 'A' }).end((err, res) => {
            expect(res.status).to.equal(200)
            expect(res.body.id).not.to.eq(undefined)
            
            chai.request(websiteURL).get('/api/student/5').end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.name).to.eq('Kacha')
            })
        })
    })


})

describe('Update Test.', () => {

    it('Only fields mention in put request should be updated and rest should remain unchanged.', () => {
        chai.request(server).keepOpen().put('/api/student/2').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Goli' }).end((err, res) => {
            expect(res.status).to.eq(200)
            chai.request(server).get('/api/student/2').end((err, res) => {
                expect(res.status).to.eq(200)
                expect(res.body.name).to.eq('Goli')
                expect(res.body.currentClass).to.eq(12)
                expect(res.body.division).to.eq('C')
            })
        })
    })

    it('Valid put request should update the student details.', () => {
        let browser = chai.request(websiteURL).keepOpen()
        browser.put('/api/student/1').set('content-type', 'application/x-www-form-urlencoded').send({ name: 'Goli', currentClass: 9, division: 'A' }).end((err, res) => {
            expect(res.status).to.eq(200)
            browser.get('/api/student/1').end((err, res) => {
                expect(res.status).to.eq(200)
                expect(res.body.name).to.eq('Goli')
                expect(res.body.currentClass).to.eq(9)
                expect(res.body.division).to.eq('A')
            }, () => { browser.close() })
        })
    })


})


describe('Delete Request Tests', () => {

    it('Delete request with valid id should remove the student record and return status 200.', () => {
        chai.request(websiteURL).delete('/api/student/1').end((err, res) => {
            expect(res.status).to.eq(200);
            chai.request(websiteURL).get('/api/student/1').end((err, res) => {
                expect(res.status).to.eq(404)
            })
        })
    })

    it('On removal of one student record the id of other student should not be altered', () => {
        chai.request(websiteURL).get('/api/student/2').end((err, res) => {
            expect(res.status).to.eq(200)
            expect(res.body.name).to.eq('Goli')
            expect(res.body.currentClass).to.eq(12)
            expect(res.body.division).to.eq('C')
        })
    })
})