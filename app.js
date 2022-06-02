const express=require('express')
const mongoose = require('mongoose');
const path = require('path');
const indexRouter=require('./routers/index')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app= express();

require('./config/passport')(passport);

// DB Config
const db = require('./config/key').mongoURI;

// Connect to MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: false ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/assets', express.static('assets'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs')


app.use(express.urlencoded({extended: false}))

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );


 // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


//Global VAr
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });



app.use(indexRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server up on port: ${PORT}`)
})