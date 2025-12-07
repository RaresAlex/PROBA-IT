const mongoose = require('mongoose');

const User = require('../models/User.model')

const createUser = async (req, res) => {
    const body = req.body;
    const name = body.name;
    const age = body.age;
    const birthdate = body.age;

    const User = new User ({
        name: name,
        age: age,
        birthdate: birthdate
    })

    await user.save();
    return
}
