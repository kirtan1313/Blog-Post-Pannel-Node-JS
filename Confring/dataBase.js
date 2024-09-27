const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mkirtan013:KvJNO0YeJrikMEFt@cluster0.egcsg.mongodb.net/blog-post')
  .then(() => console.log('Data base is Connected Successfully....')).catch((err)=>{
    console.log('Database conectivity is faild..!',err);
  });
