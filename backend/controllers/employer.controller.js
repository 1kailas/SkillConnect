import Employer from '../models/Employer.model.js';

// @desc    Get single employer
// @route   GET /api/employers/:id
// @access  Public
export const getEmployer = async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.params.id).select('-password');

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employer profile
// @route   PUT /api/employers/profile
// @access  Private/Employer
export const updateEmployer = async (req, res, next) => {
  try {
    // Whitelist allowed fields
    const allowedFields = [
      'name', 'phone', 'avatar', 'companyName', 'companyDescription',
      'website', 'companySize', 'industry', 'location'
    ];
    
    const fieldsToUpdate = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Ensure no protected fields can be updated
    delete fieldsToUpdate.password;
    delete fieldsToUpdate.role;
    delete fieldsToUpdate.email;
    delete fieldsToUpdate.isActive;
    delete fieldsToUpdate.isVerified;

    const employer = await Employer.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: employer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employer account
// @route   DELETE /api/employers/profile
// @access  Private/Employer
export const deleteEmployer = async (req, res, next) => {
  try {
    await Employer.findByIdAndUpdate(req.user._id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
