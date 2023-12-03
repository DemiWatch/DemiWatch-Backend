const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
  nama: String,
  umur: Number,
  jenisPenyakit: String,
  catatan: String,
  kode: String,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
