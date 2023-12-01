import http from "http";
import dotenv from 'dotenv'
import { handleRequest } from './handleRequests.js';
import cluster from "cluster";
import * as os from 'os';
dotenv.config()
const numCPUs = os.cpus().length;
const Port = Number(process.env.PORT)

export let server
const multi = process.argv.includes('--multi')

if(cluster.isPrimary){
    primary()
  }else{
    isWorker(multi)
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

function isWorker (arg){
if(arg){
  server = http.createServer((req, res)=>handleRequest(req, res));
  server.listen(Port +1 ,   () => {
    console.log(
      `Worker ${cluster?.worker.id} is listening on port ${
        Port + cluster?.worker.id
      }`
    );
  });
}else{
  server = http.createServer((req, res)=>handleRequest(req, res));
  server.listen(Port  ,   () => {
    console.log(
      `Port is running`
    );
  });
}


}

process.on("message", (message) => {
  server.emit("message", message);
});

