const User = require('../models/userModel.js');

async function addUser(req, res) {
    const { id } = req.params;
    const { nama, telepon, status, radius } = req.body;
  
    if (!nama || !telepon || !status || !radius) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: 'Each column must be filled in'
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
          error: "User not found"
        });
      }
  
      res.status(200).json({
        status: 200,
        success: true,
        message: 'User data saved successfully',
        data: dataUser
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        error: "An error occurred while saving user data"
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
        error: 'User data not found'
    });
    }

    res.json({ data: dataUser });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred while retrieving user data'
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
        error: 'User data not found'
      });
    }
    res.json({
      status: 200,
      success: true,
      message: 'User data is updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred while updating user data'
    });
  }
}

module.exports = {
  updateUser,
  getUser,
  addUser
};
