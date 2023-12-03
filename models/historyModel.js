const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  longitude: Number,
  latitude: Number,
});
const locationHistorySchema = new mongoose.Schema({
  message: String,
  alamatRumah: {
    name : String,
    longi: Number,
    lat: Number
  },
  alamatTujuan: {
    name : String,
    longi: Number,
    lat: Number
  },
  location: {type: locationSchema, required: true},
  timestamp: { type: Date, default: Date.now },
  newLog: { type: Boolean, default: false }
});
const historySchema = new mongoose.Schema({
  kode: String,
  locationHistory:[locationHistorySchema]
});

const History = mongoose.model('History', historySchema);

module.exports = History;
