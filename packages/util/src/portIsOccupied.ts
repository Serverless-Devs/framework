import net from 'net';

function portIsOccupied(port: number) {
  const server = net.createServer().listen(port);
  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      server.close();
      resolve(port);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(portIsOccupied(port + 1));
      } else {
        reject(err);
      }
    });
  });
}

export = portIsOccupied;
