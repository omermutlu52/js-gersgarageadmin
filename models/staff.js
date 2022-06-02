const mongoose= require('mongoose')

const StaffSchema  = new mongoose.Schema({

name:{
    type:String,
    require:true,
    trim:true
},
pos:{
    type:String,
    require:true,
    trim:true
},
email:{
    type:String,
    require:true,
    trim:true
},
number:{
    type:String,
    require:true,
    trim:true,
}

})

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff