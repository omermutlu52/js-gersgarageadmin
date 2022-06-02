const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Admin=require('../models/admin')
const Booking=require('../models/booking')
const Staff=require('../models/staff')
const User=require('../models/user')
const Spare=require('../models/spare-part')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/', (req,res)=>{res.render('login',{
    user:req.user
})})

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });


  router.get('/dashboard', ensureAuthenticated,(req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/customers', ensureAuthenticated, (req, res) =>
User.find({},function(err,data){
  res.render('customers', {
    user: req.user,
    customer:data
  })
})
);

router.get('/spare', ensureAuthenticated, (req, res) =>
Spare.find({},function(err,data){
  res.render('spare', {
    user: req.user,
    spare:data
  })
})
);

router.get('/spare-add', ensureAuthenticated,(req, res) =>
res.render('spare-add', {
  user: req.user
})
);

router.post('/spare-add', (req, res) => {
    const { name,description,price,stock,user } = req.body;
    let errors = [];
  
    Spare.findOne({name:name}).then((data)=>{
     if(data){
        req.flash(
          'error_msg',
          'Spare-part already in the stock'
        );
    res.redirect('/spare-add');
     }else{
      const newSpare = new Spare({
        name,description,price,stock
      });
  
     
        newSpare.save().then(data=>{
          req.flash(
            'success_msg',
            'Spare part added to stock'
          );
      res.redirect('/spare');
        }).catch((err)=>{
        console.log(err)
        })
     }
    }).catch((e)=>{
      console.log(e)
    })   
      });


router.get('/spare-edit', ensureAuthenticated, (req, res) =>
  Spare.findOne({_id:req.query.id},function(err,data){
  res.render('spare-edit', {
    user: req.user,
    spare:data
  })
})
);

router.post('/spare-edit', (req, res) => {
        const { name,user,id } = req.body;
        let errors = [];
        const change={price,stock,description}=req.body;


        Spare.updateOne({"_id":id},{$set:change}).then((spare)=>{
          req.flash(
            'success_msg',
            `Spare part updated succesfully`
          );
      res.redirect('/spare');

        }).catch(()=>{})
        
          });

router.get('/spare-delete', ensureAuthenticated, (req, res) =>
          Spare.findOne({_id:req.query.id},function(err,data){
         res.render('spare-delete', {
           user: req.user,
           spare:data
         })
       })
       );

router.post('/spare-delete', (req, res) => {
            const { name,user,id,description,price,stock } = req.body;
    
            Spare.deleteOne({"_id":id}).then((spare)=>{
              req.flash(
                'error_msg',
                `Spare part deleted from stock`
              );
          res.redirect('/spare');
    
            }).catch(()=>{})
            
              });


router.get('/staff', ensureAuthenticated, (req, res) =>
              Staff.find({},function(err,data){
                res.render('staff', {
                  user: req.user,
                  staff:data
                })
              })
              );
              
router.get('/staff-add', ensureAuthenticated,(req, res) =>
              res.render('staff-add', {
                user: req.user
              })
              );
              
router.post('/staff-add', (req, res) => {
                  const { name,pos,email,number,user } = req.body;
                  let errors = [];
                
                  Staff.findOne({name:name}).then((data)=>{
                   if(data){
                      req.flash(
                        'error_msg',
                        'Staff name already exist'
                      );
                  res.redirect('/staff-add');
                   }else{
                    const newStaff = new Staff({
                      name,pos,email,number
                    });
                
                   
                      newStaff.save().then(data=>{
                        req.flash(
                          'success_msg',
                          'Staff added'
                        );
                    res.redirect('/staff');
                      }).catch((err)=>{
                      console.log(err)
                      })
                   }
                  }).catch((e)=>{
                    console.log(e)
                  })   
                    });
 
router.get('/staff-edit', ensureAuthenticated, (req, res) =>
                    Staff.findOne({_id:req.query.id},function(err,data){
                   res.render('staff-edit', {
                     user: req.user,
                     staff:data
                   })
                 })
                 );
                 
router.post('/staff-edit', (req, res) => {
                         const { name,user,id } = req.body;
                         let errors = [];
                         const change={pos,email,number}=req.body;
                 
                 
                         Staff.updateOne({"_id":id},{$set:change}).then((staff)=>{
                           req.flash(
                             'success_msg',
                             `Staff updated succesfully`
                           );
                       res.redirect('/staff');
                 
                         }).catch(()=>{})
                         
                           });   

router.get('/staff-delete', ensureAuthenticated, (req, res) =>
  Staff.findOne({_id:req.query.id},function(err,data){
  res.render('staff-delete', {
           user: req.user,
           staff:data
         })
       })
       );

router.post('/staff-delete', (req, res) => {
            const { name,user,id,pos,email,number } = req.body;
    
            Staff.deleteOne({"_id":id}).then((staff)=>{
              req.flash(
                'error_msg',
                `Staff deleted`
              );
          res.redirect('/staff');
    
            }).catch(()=>{})
            
              });

router.get('/booking', ensureAuthenticated, (req, res) =>
Booking.find({},function(err,data){
res.render('booking', {
    user: req.user,
    booking:data,
    Spare:Spare
                 })
                   })
                      );         
                      
router.get('/add-spare', ensureAuthenticated, (req, res) =>
Spare.find({},function(err,data){
res.render('add-spare', {
user: req.user,
spare:data,
book_id:req.query.id
  })
        })
            );     
            
router.post('/add-spare',ensureAuthenticated ,(req, res) => {
const { name,user,book_id,spare } = req.body;
let errors = [];
const change={spare_part}=req.body;

Booking.updateOne({"_id":book_id},{$set:change}).then((spare)=>{
req.flash(
'success_msg',
`Spare part added succesfully`
           );
res.redirect('/booking');
      
  }).catch(()=>{})
              
          });

router.get('/add-staff', ensureAuthenticated, (req, res) =>
Staff.find({},function(err,data){
res.render('add-staff', {
user: req.user,
staff:data,
book_id:req.query.id
     })
         })
            );     
                      
router.post('/add-staff',ensureAuthenticated ,(req, res) => {
const { name,user,book_id,staff } = req.body;
let errors = [];

const change={staff}=req.body;
          
Booking.updateOne({"_id":book_id},{$set:change}).then((spare)=>{
  req.flash(
   'success_msg',
   `Staff added succesfully`
                     );
  res.redirect('/booking');
                
}).catch(()=>{})
                        
                    });
        
router.get('/logout', (req, res) => {
req.logout();
req.flash('success_msg', 'You are logged out');
res.redirect('/');
  });
 
router.get('/profile', ensureAuthenticated, (req, res) =>
  Admin.findOne({"_id":"628641e741b8cc66446c7ce9"},function(err,data){
    res.render('profile', {
      user: req.user,
      admin:data
    })
  })
  );  

module.exports=router;