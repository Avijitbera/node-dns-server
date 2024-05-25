const dnsPacket = require('dns-packet')
const {PrismaClient} = require('@prisma/client')
const dgram = require('node:dgram')


const prisma = new PrismaClient()
const server = dgram.createSocket('udp4')

const db = {
    "google.com":{
        type:"A",
        data:'9.4.2.1'
    },
    "site.google.com":{
        type:"CNAME",
        data:"newsite.com"
    }
}

server.on('listening', () =>{
    console.log("Server is listening")
})

server.on('message', async (msg, info) =>{
    
    const message = dnsPacket.decode(msg)
    const data = await prisma.domain.findFirst({
        where:{
            name:message.questions[0].name
        }
    })
    // const ipFromDb = db[message.questions[0].name]

    const ans = dnsPacket.encode({
        type:'response',
        id:message.id,
        flags:dnsPacket.AUTHORITATIVE_ANSWER,
        questions:message.questions,
        answers:[{
            type:data.type,
            class:'IN',
            name:message.questions[0].name,
            data:data.data
        }]
    })
    server.send(ans, info.port, info.address)
    
})

server.bind(5345, () =>{
    console.log("DNS Server running on 5345")
})