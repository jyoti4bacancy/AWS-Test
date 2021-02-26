require('dotenv/config');
const express=require('express')
const multer=require('multer')


const port=process.env.port||3000
const AWS=require('aws-sdk')
//const uuid=require('uuid/v4')


const app=express()
const storage=multer.memoryStorage({
    destination: function(req,file,callback){
        callback()
    }
})
const s3=new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})
const upload=multer({storage}).single('image')


app.post('/upload',upload,(req,res)=>{
 let filename=req.file.originalname.split('.')
 let filetype=filename[filename.length-1]

    // console.log(req.file)
    // res.send({
    //     message:'hello'
    // })
    let r = Math.random().toString(36).substring(7);

    const params={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${r}.${filetype}`,
        Body: req.file.buffer
    }
    s3.upload(params,(error,data)=>{
        if(error){
            return res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

app.listen(port,()=>{
    console.log("app listening on "+port)
})