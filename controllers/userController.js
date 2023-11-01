const User = require('../models/userModel.js');

async function addUser(req, res) {
    const { id } = req.params;
    const { nama, telepon, status, radius } = req.body;
  
    if (!nama || !telepon || !status || !radius) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: 'Semua kolom harus diisi'
      });
    }
  
    try {
      const dataUser = await User.findByIdAndUpdate(id, {
        nama,
        telepon,
        status,
        radius
      }, { new: true });
  
      if (!dataUser) {
        return res.status(404).json({
          status: 404,
          success: false,
          error: "User tidak ditemukan"
        });
      }
  
      res.status(201).json({
        message: 'Data user berhasil disimpan',
        data: dataUser
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        error: "Terjadi kesalahan saat menyimpan data user"
      });
    }
}  

async function getUser(req, res) {
  const { id } = req.params; 
  try {
    const dataUser = await User.findById(id);

    if (!dataUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Data pasien tidak ditemukan'
    });
    }

    res.json({ data: dataUser });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pasien'
    });
  }
}

// async function updatePatient(req, res){
//   const { id } = req.params;
//   const { nama, umur, jenisPenyakit, catatan, kode } = req.body;
//   const alamatRumah = { longi: 112.796075, lat: -7.284068 };
//   const alamatTujuan = { longi: 112.796251, lat: -7.290800 };
//   try {
//     const updatedPatient = await Patient.findByIdAndUpdate(id, {
//       nama,
//       umur,
//       jenisPenyakit,
//       catatan,
//       kode,
//       alamatRumah,
//       alamatTujuan,
//     }, { new: true });

//     if (!updatedPatient) {
//       return res.status(404).json({
//         status: 404,
//         success: false,
//         message: 'Data pasien tidak ditemukan'
//       });
//     }

//     res.json({
//       message: 'Data pasien berhasil diperbarui',
//       data: updatedPatient
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: 'Terjadi kesalahan saat memperbarui data pasien'
//     });
//   }
// }

// async function getPatientByKode(kode) {
//   return await Patient.findOne({ kode: kode });
// }

module.exports = {
  addUser,
  getUser
};
