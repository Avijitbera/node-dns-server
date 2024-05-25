const express = require('express')
const {PrismaClient} = require('@prisma/client')
const app = express()

const prisma = new PrismaClient()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/list", async(req, res) =>{
    const data = await prisma.domain.findMany({
        
    })
    return res.json({data, success:true})
})

app.post("/add", async (req, res) =>{
    const type = req.body.type
    const name = req.body.name
    const data = req.body.data
    
    const result = await prisma.domain.findFirst({
        where:{
            name:name
        }
    })
    if(result == null){
        const _data = await prisma.domain.create({
            data:{
                name:name,
                type:type,
                data:data
            }
        })
        return res.json({success:true, data:_data})
    }else{
        return res.json({error:true, data:result})
    }
    
})

app.listen(5001)

