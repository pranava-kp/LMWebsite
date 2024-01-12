const express=require('express');
const router=express.Router();

// AUTH ENDPOINTS
const {signup}=require('../controller/Signup');
const {login}=require('../controller/Login');
const {dashboard}=require('../middleware/auth');
const {auth}=require('../middleware/auth');

// FILE ENDPOINTS
const{imageUpload}=require('../controller/File');
const{getAllFiles}=require('../controller/File');

// AUTH ROUTES
router.post('/signup',signup);
router.post('/login',login);
router.get('/dashboard',auth,dashboard);

// FILE ROUTES
router.post('/imageUpload', imageUpload);
router.get('/getAllimage', getAllFiles);
module.exports=router;