const Patient = require('../models/patientModel.js');

async function tambahPatient(req, res) {
  const { nama, umur, jenisPenyakit, catatan, kode } = req.body;
  const alamatRumah = { longi: 112.796075, lat: -7.284068 };
  const alamatTujuan = { longi: 112.796251, lat: -7.290800 };

  if (!nama || !umur || !jenisPenyakit || !catatan || !kode || !alamatRumah || !alamatTujuan) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    const dataPatient = await Patient.create({
      nama,
      umur,
      jenisPenyakit,
      catatan,
      kode,
      alamatRumah,
      alamatTujuan,
    });

    res.status(201).json({ message: 'Data pasien berhasil disimpan', data: dataPatient });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data pasien' });
  }
}

async function getPatient(req, res) {
  const { id } = req.params; 

  try {
    const dataPatient = await Patient.findById(id);

    if (!dataPatient) {
      return res.status(404).json({ message: 'Data pasien tidak ditemukan' });
    }

    res.json({ data: dataPatient });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pasien' });
  }
}

async function updatePatient(req, res){
  const { id } = req.params;
  const { nama, umur, jenisPenyakit, catatan, kode } = req.body;
  const alamatRumah = { longi: 112.796075, lat: -7.284068 };
  const alamatTujuan = { longi: 112.796251, lat: -7.290800 };
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
      return res.status(404).json({ message: 'Data pasien tidak ditemukan' });
    }

    res.json({ message: 'Data pasien berhasil diperbarui', data: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data pasien' });
  }
}

module.exports = {
  tambahPatient,
  getPatient,
  updatePatient
};
