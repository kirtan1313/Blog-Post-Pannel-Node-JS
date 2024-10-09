const authModule = require('../../Modules/Authontication')
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const transformer = nodemailer.createTransport({
  service : 'gmail',
  auth: {
    user: 'mkirtan013@gmail.com',
    pass: 'dqbmmlmbxzfjsstn',
  },
  tls: {
    rejectUnauthorized: false, 
  },
})

let myOtp = null;


const userLoginFormController = (req, res) => {
  res.render('login')
}

const userLogoutController = async (req, res) => {
  req.logout((err) => {
    if (err) {
      done(err)
    } else {
      res.redirect('/login')
    }
  })
}

const changePassword = (req, res) => {

  res.render('changePasss');
}

const updatePassword = (req, res) => {
  const { password } = req.user;
  const { curr_Pass, new_Pass, conf_Pass } = req.body;

  bcrypt.compare(curr_Pass, password, (err, result) => {
    if (result) {
      console.log('pass Match');
      if (new_Pass == conf_Pass) {
        bcrypt.hash(new_Pass, 10, async (err, hashPass) => {
          console.log('hashhh', hashPass);
          if (err) {
            res.redirect('/changePasss')
          }
          const upadtePass = await authModule.updateOne({ _id: req.user._id }, { password: hashPass })
          console.log('upadtepasss', upadtePass);
          if (upadtePass) {
            res.redirect('/login')
          }
        })
      }
    } else {
      console.log('pass Not Match');
    }
  })

}


const forgetPassword = (req, res) => {

  res.render('forgetPassForm')

}

const checkEmailAuth = async (req, res) => {

  let { email } = req.body;
  console.log('email', email);

  let userData = await authModule.findOne({ email: email })
  console.log('userData', userData);

  if (userData) {
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    myOtp = otp
    console.log("otp", otp);

    let mailOpt = {
      from: 'mkirtan013@gmail.com',
      // to: userData.email,
      to : 'yash.s.p86@gmail.com',
      subject: 'Reset Password',
      text: `Your OTP is ${otp}`
    }

    transformer.sendMail(mailOpt);
    res.redirect(`/otpValidation/${userData._id}`);
  } else {
    res.redirect('/forgetPassForm');
  }
}

const otpValidation = (req, res) => {
  const { id } = req.params;
  res.render('otpValidation', { id })
}

const verify_otp = (req, res) => {
  const { id } = req.params;
  if (myOtp == req.body.otp) {
    res.render('resetPass', { id })
  } else {
    res.redirect('/otpValidation')
  }
}

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { new_Pass1, conf_Pass1 } = req.body;

  const resetUser = await authModule.findOne({ _id: id })

  if (resetUser) {
    bcrypt.hash(new_Pass1, 10, async (er, hash) => {
      let updateP = await authModule.updateOne({ _id: resetUser }, { password: hash })
      console.log('updatePass', updateP);
      console.log('updatePass hash', hash);
      res.redirect('/login')
    })
  } else {
    res.redirect('/signup')
  }
}


module.exports = { userLoginFormController, userLogoutController, changePassword, updatePassword, forgetPassword, checkEmailAuth, otpValidation, verify_otp, resetPassword }