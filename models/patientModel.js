const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  message: String,
  location: {
    longi: Number,
    lat: Number
  },
  timestamp: { type: Date, default: Date.now },
  newLog: { type: Boolean, default: false }
});
const patientSchema = new mongoose.Schema({
  nama: String,
  umur: Number,
  jenisPenyakit: String,
  catatan: String,
  kode: String,
  // img:{
  //   data:Buffer,
  //   contentType : String
  // },
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
  locationHistory:[locationHistorySchema]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
