const Patient = require('../models/patientModel.js');

async function tambahPatient(req, res) {
  const { nama, umur, jenisPenyakit, catatan, kode } = req.body;
  const alamatRumah = {
    name: "Rumah",
    longi: 112.7912281,
    lat: -7.289606,
    desc : "Asrama Mahasiswa ITS, Jl. Teknik Elektro, Keputih, Sukolilo, Surabaya"
  };
  const alamatTujuan = {
    name: "Supermarket",
    longi: 112.796251,
    lat: -7.290800,
    desc: "Jl. Arief Rahman Hakim No.32, Keputih, Kec. Sukolilo, Surabaya"
  };

  if (!nama || !umur || !jenisPenyakit || !catatan || !kode || !alamatRumah || !alamatTujuan) {
    return res.status(400).json({
      status: 400,
      success: false,
      error: 'Each column must be filled in'
    });
  }

  try {
    const existingKode = await Patient.findOne({ kode });
    if (existingKode) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: 'Kode already used in another device'
      });
    }
    const dataPatient = await Patient.create({
      nama,
      umur,
      jenisPenyakit,
      catatan,
      kode,
      alamatRumah,
      alamatTujuan
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Patient data saved successfully', 
      data: dataPatient 
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while saving patient data"
    });
  }
}

async function getPatient(req, res) {
  const { id } = req.params; 

  try {
    const dataPatient = await Patient.findById(id);

    if (!dataPatient) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Patient data not found'
      });
    }

    res.json({ data: dataPatient });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred while retrieving patient data'
    });
  }
}

async function updatePatient(req, res){
  const { id } = req.params;
  const { nama, umur, jenisPenyakit, catatan, kode } = req.body;
  const alamatRumah = { name: "Rumah", longi: 112.796075, lat: -7.284068 };
  const alamatTujuan = { name: "FTE", longi: 112.796251, lat: -7.290800 };
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, {
      nama,
      umur,
      jenisPenyakit,
      catatan,
      kode,
      alamatRumah,
      alamatTujuan,
    }, { new: true });

    if (!updatedPatient) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Patient data not found'
      });
    }

    res.json({
      status: 200,
      success: true,
      message: 'Patient data is updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred while updating patient data'
    });
  }
}

async function getPatientByKode(kode) {
  return await Patient.findOne({ kode: kode });
}

module.exports = {
  tambahPatient,
  getPatient,
  updatePatient,
  getPatientByKode
};
