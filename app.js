const express= require('express')
const multer=require('multer')
const path=require('path')
const ejs=require('ejs')


//set Storage engine
const storage =multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//Initialise upload variable

const upload= multer({
    storage:storage,
    limits:{
        fieldSize:100000
    },
    fileFilter:function(req, file, cb){
        checkFileType(file,cb)
    }
}).single('mayImage')
//Init app

const app=express()
//EJS
app.set('view engine', 'ejs')

//Public folder
app.use(express.static('./public'))

const port=5000
app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/upload', (req,res)=>{
   upload(req,res, (err)=>{
       if(err){
           res.render('index', {
               msg:err
           })
       }else{

         if(req.file==undefined){
             res.render('index',{
                 msg: 'Error: no file selected'
             })
         }else{
             res.render('index',{
                 msg:'File uploaded',
                 file:`uploads/${req.file.fieldname}`
             })
         }
       }
   })
})
app.listen(port, ()=>    console.log(`server running on port ${port}`)
)


// checj file type
function checkFileType(file, cb){
//Allowed ext types
const fileTypes= /jpeg|jpg|png|gif/

//check ext
const extName= fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())

//check mime

const mimeType = fileTypes.test(file.mimetype)

if(mimeType && extName){
    return cb(null, true)
}else{
    cb('Error: images only')
}
}