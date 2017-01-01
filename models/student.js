'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Student = new Schema({
    code: {
        type: String,
        unique: true,
        require: true
    },
    name: {
        type: String
    },
    birthday: {
        type: String
    },
    regular_class: {
        type: String
    },
    subject_classes: {
        type: [Schema.Types.Mixed]
    }
});

mongoose.model('Student', Student);