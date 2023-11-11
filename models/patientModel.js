const mongoose = require('mongoose');

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
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
