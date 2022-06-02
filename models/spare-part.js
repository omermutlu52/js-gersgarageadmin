const mongoose= require('mongoose')

const SpareSchema  = new mongoose.Schema({

name:{
    type:String,
    require:true,
    trim:true
},
description:{
    type:String,
    require:true,
    trim:true
},
stock:{
    type:String,
    require:true,
    trim:true
},
price:{
    type:String,
    require:true,
    trim:true,
}

})

const Spare = mongoose.model('Spare', SpareSchema);

module.exports = Spare