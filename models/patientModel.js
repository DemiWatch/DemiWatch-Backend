const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nama: String,
  umur: Number,
  jenisPenyakit: String,
  catatan: String,
  kode: String,
  alamatRumah: {
    longi: Number,
    lat: Number
  },
  alamatTujuan: {
    longi: Number,
    lat: Number
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
