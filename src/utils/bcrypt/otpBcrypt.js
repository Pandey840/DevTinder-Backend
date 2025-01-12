const bcrypt = require('bcryptjs');

const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

const compareOTP = async (otp, hashedOtp) => {
  return bcrypt.compare(otp, hashedOtp);
};

module.exports = {hashOTP, compareOTP};
