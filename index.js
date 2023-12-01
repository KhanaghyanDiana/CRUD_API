import http from "http";
import dotenv from 'dotenv'
import { handleRequest } from './handleRequests.js';
import cluster from "cluster";
import * as os from 'os';
dotenv.config()
const numCPUs = os.cpus().length;
const Port = process.env.PORT

export let server


  if(cluster.isPrimary){
    primary()
  }else{
    isWorker()

  server = http.createServer((req, res)=>handleRequest(req, res))
  server.listen(Port, ()=>{
    console.log(`Port is Running`);
  } )

}

function primary(){
  const workers = [];
  for (let i = 0; i < numCPUs - 1; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  let nextWorkerIndex = 0;
  cluster?.on("message", (message) => {
    const nextWorker = workers[nextWorkerIndex];
    nextWorker.send(message);
    nextWorkerIndex = (nextWorkerIndex + 1) % workers.length;
  });

  cluster.on("exit", (worker) => {
    const nextWorker = cluster.fork();
    const index = workers.indexOf(worker);
    worker[index] = nextWorker;
  });

}

function isWorker (){
  server = http.createServer((req, res)=>handleRequest(req, res))
    server.listen(Port ,  Port + 1, () => {
      console.log(
        `Worker ${cluster?.worker.id} is listening on port ${
          4000 + cluster?.worker.id
        }`
      );
    });

}

process.on("message", (message) => {
  server.emit("message", message);
});

