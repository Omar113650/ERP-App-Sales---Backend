// import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway()
// export class ChatGateway implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;

//   onModuleInit() {
//     this.server.on('connection', (client) => {
//       console.log(`client connected:${client.id}`);
//     });
//   }
  // ====================================================

  //   هعمل قناه عشان الرسايل تروح عليها
  //   وبعت رسال للكل

//   @SubscribeMessage('NewSentMessage')
//   NewSentMessage(@MessageBody() message: string) {
//     this.server.emit('NewSentMessage', message);
//   }
  // ====================================================

  // هبعت رساله ل كلينت واحد بس

//   @SubscribeMessage('SentMessageToSingleClient')
//   SentMessageToSingleClient(
//     @MessageBody() data: { TargetClientId: string; message: string },
//   ) {
//     const TargetClient = this.server.sockets.get(data.TargetClientId);
//     TargetClient.emit('SentMessageToSingleClient', data.message);
//   }
// }
