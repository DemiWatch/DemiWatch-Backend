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
      error: 'Terjadi kesalahan saat mengambil data pasien'
    });
  }
}

async function updateUser(req, res){
  const { id } = req.params;
  const { nama, telepon, status, radius } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      nama,
      telepon,
      status,
      radius
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Data user tidak ditemukan'
      });
    }
    res.json({
      message: 'Data user berhasil diperbarui',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'Terjadi kesalahan saat memperbarui data pasien'
    });
  }
}

module.exports = {
  updateUser,
  getUser,
  addUser
};
