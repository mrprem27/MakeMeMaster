const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationBuySchema = mongoose.Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' }, 
    course: { type: Schema.Types.ObjectId, ref: 'Course' }, 
    price: { type: Number },
    class: { type: Schema.Types.ObjectId, ref: 'Class' } },
    { timestamps: true}
    );
const NotificationBuy = mongoose.model('NotificationBuy', notificationBuySchema);
module.exports = NotificationBuy;