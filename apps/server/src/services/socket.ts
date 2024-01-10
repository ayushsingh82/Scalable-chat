import {Server} from 'socket.io'
import { Redis } from 'ioredis';

const pub=new Redis({
    host:'redis-3d25e7c1-ayushsinghmi713-99d8.a.aivencloud.com',
    port:14649,
    username:'default',
    password:'AVNS_qSr5rkx1RAUadx_6HkA'
});
const sub= new Redis({
    host:'redis-3d25e7c1-ayushsinghmi713-99d8.a.aivencloud.com',
    port:14649,
    username:'default',
    password:'AVNS_qSr5rkx1RAUadx_6HkA'
})

class SocketService {
    private _io:Server;


    constructor(){
        console.log('Init Socket Server..')
        this._io=new Server({
            cors:{
                allowedHeaders:["*"],
                origin:"*",
            }
        })
        sub.subscribe('MESSAGES');
    }

    public initListeners(){
        const io=this.io;
        console.log('Init Socket Listeners...');

        io.on('connect',async socket=>{
            console.log(`New socket connected`,socket.id);

            socket.on('event:message',async({message}:{message:string})=>{
                console.log(`New Message rec.`,message)
                //publish this message to redis
                await pub.publish('MESSAGES',JSON.stringify({message}))
            })
        })
       sub.on('message',(channel,message)=>{
        if(channel==='MESSAGES'){
            io.emit('message',message);
        }
       })
    }

    get io(){
        return this._io;
    }
}

export default SocketService;