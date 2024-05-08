import {Schema, model, models, Document} from 'mongoose';



const ReminderItemSchema =  new Schema({
    reminder: {type: String, required: true},
    setDate: {type: Date, required: true},
    dueDate: {type: Date}
});

const ReminderSchema = new Schema({
    userObjectId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    remindersArray: [ReminderItemSchema],
});

const Reminder = models?.Reminder || model<ReminderDocument>('Reminder', ReminderSchema);

export { Reminder }