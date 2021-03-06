'use strict';

/**
 * Mail-sender check class and subscriber to send email
 */

const async = require('async');
const Mongoose = require('mongoose');

let services = require('../services');
const Class = Mongoose.model('Class');
const Subscriber = Mongoose.model('Subscriber');

function checkSubscribers(dataHolder) {
    for (let subscriber of dataHolder.subscribers) {
        checkEachSubscriber(subscriber, dataHolder.classes);
    }
}

function checkEachSubscriber(subscriber, classHasScores) {
    async.each(subscriber.subject_classes,
        (tempClass, next) => {
            for (let tempClassScore of classHasScores) {
                if (!tempClass.is_send_mail && (tempClassScore.code == tempClass.class_id)) {
                    // send mail and next()
                    console.log(tempClassScore);
                    console.log('--------------');

                    sendMailAndSave(subscriber, tempClass, tempClassScore);
                }
            }
            next();
        },
        err => {
            if (err) console.log(err);
        });
}

function sendMailAndSave(subscriber, classSubscriber, classHasScore) {
    let userInfo = {
        name: subscriber.name,
        email: subscriber.email,
        class_name: classHasScore.name,
        link: classHasScore.link
    };

    services.email
        .sendNotiEmail(userInfo)
        .then(
            msg => {
                classSubscriber.is_send_mail = true;
                classSubscriber.save()
                    .catch(err => console.log(err));
            }
        )
        .catch(err => console.log(err));
}

module.exports = function () {
    let dataHolder = {};

    // Fetch data
    Subscriber
        .find({is_active: true})
        .populate('subject_classes')
        .exec()
        .then(subscribers => {
            dataHolder.subscribers = subscribers;

            return Class.find({is_has_score: true}).exec();
        })
        .then(classes => {
            dataHolder.classes = classes;

            checkSubscribers(dataHolder);
        })
        .catch(err => console.log(err));
};