const express = require('express');
const router = express.Router();
const controller = require('../Controllers/myControllers')
const loginController = require('../Controllers/Users/loginUser')
const registerController = require('../Controllers/Users/registrationUser')
const BlogController = require('../Controllers/blogController')
const upload = require('../Confring/imageUplode')
const passport = require('../Confring/passport_confi')
const isAuth = require('../meddlewere/midlewereAuth')


router.get('/',isAuth,controller.defaultController);

router.get('/addForm',isAuth, BlogController.addBlogFormController)
router.post('/addblog',isAuth, upload.single('image'), BlogController.createBlogController)
router.get('/allblog',isAuth, BlogController.getBlogController)
router.get('/myBlogs' ,isAuth,BlogController.myBlogerController)
router.get('/edit/:id',isAuth,BlogController.editBlogController)
router.post('/updateBlogs/:id',isAuth, upload.single('updateimg'),BlogController.updateBlogController)
router.get ('/delete/:id',isAuth, BlogController.deleteBlogController)

router.get('/signup',registerController.userRegFormController)
router.post('/signuppost',registerController.userRegFormPostController)

router.get('/login',loginController.userLoginFormController)
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }))
router.get('/logout' ,loginController.userLogoutController)

router.get('/changepass',isAuth,loginController.changePassword)
router.post('/upadetPass',loginController.updatePassword)

router.get('/forgrtPass',loginController.forgetPassword)
router.post('/reset-password',loginController.checkEmailAuth);

router.get('/otpValidation/:id',loginController.otpValidation)
router.post('/verify-otp/:id',loginController.verify_otp)

router.post('/resetPassword/:id',loginController.resetPassword)

router.get('/addTopic', isAuth, BlogController.add_topic);  
router.post('/add-topic', isAuth, BlogController.addTopic);

router.post('/delete-topic', BlogController.deleteTopic);

module.exports = router;
