const { Schema, model } = require('mongoose')
const Mixed = Schema.Types.Mixed

const auditSchema = Schema({
    owner: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    lastScan: {
        type: Date,
        required: true
    },
    standard:{
        type: String,
        required: true
    },
    audit: {
        type: Mixed,
        required: true
    }
})

const Audit = model('audit', auditSchema);

module.exports = Audit;