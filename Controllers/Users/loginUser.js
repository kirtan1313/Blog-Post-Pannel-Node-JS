const authModule = require('../../Modules/Authontication')
const bcrypt = require('bcrypt');



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
        if(new_Pass == conf_Pass){
          bcrypt.hash(new_Pass, 10, async (err, hashPass) => {
            console.log('hashhh',hashPass);
            if(err){
              res.redirect('/changePasss')
            }

            const upadtePass = await authModule.updateOne({_id:req.user._id},{password:hashPass})
            console.log('upadtepasss',upadtePass);
            if(upadtePass){
              res.redirect('/login')
            }
          })
        }
      } else {
      console.log('pass Not Match');
    }
  })

}

module.exports = { userLoginFormController, userLogoutController, changePassword, updatePassword }