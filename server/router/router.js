const express=require('express');
const router=express.Router();

// AUTH ENDPOINTS
const {signup}=require('../controller/signup');
const {login}=require('../controller/login');
const {dashboard}=require('../middleware/auth');
const {auth}=require('../middleware/auth');

// FILE ENDPOINTS
const{Localfileupload}=require('../controller/File');
const{imageupload}=require('../controller/File');
const{getallfiles}=require('../controller/File');
const{countincrease}=require('../controller/File');

// AUTH ROUTES
router.post('/signup',signup);
router.post('/login',login);
router.get('/dashboard',auth,dashboard);

// FILE ROUTES
// router.post('/localfileupload',Localfileupload);
router.post('/imageupload',imageupload);
router.get('/getAllimage',getallfiles);
router.put('/increasecount',countincrease);
module.exports=router;