const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Customer, validate } = require('../models/customer');

// =====Create: post=============
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    try {
        customer = await customer.save();
        console.log(customer);
        res.send(customer);
    } catch (err) { console.log('Error', err.message); }
});

// =============Read: get=============
// the whole list
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort('name');
        console.log(customers);
        res.send(customers);
    } catch (err) { console.log('Error', err.message); }
});

// specific genre
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Genre not found.");

    console.log(customer);
    res.send(customer);
});


// =============Update: put=============
router.put('/:id', async (req, res) => {
    // validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find and update
    let customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }
    }, { new: true });
    if (!customer) return res.status(404).send("Genre not found.");

    console.log(customer);
    res.send(customer);
})

// =============Delete: delete=============
router.delete('/:id', async (req, res) => {
    // find and delete
    let customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send("Genre not found.");

    console.log(customer);
    res.send(customer);
})

module.exports = router;



