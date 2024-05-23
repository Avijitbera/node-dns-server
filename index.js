const dnsPacket = require('dns-packet')

const dgram = require('node:dgram')

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

server.on('message', (msg, info) =>{
    
    const message = dnsPacket.decode(msg)
    const ipFromDb = db[message.questions[0].name]

    const ans = dnsPacket.encode({
        type:'response',
        id:message.id,
        flags:dnsPacket.AUTHORITATIVE_ANSWER,
        questions:message.questions,
        answers:[{
            type:ipFromDb.type,
            class:'IN',
            name:message.questions[0].name,
            data:ipFromDb.data
        }]
    })
    server.send(ans, info.port, info.address)
    
})

server.bind(5345, () =>{
    console.log("DNS Server running on 5345")
})