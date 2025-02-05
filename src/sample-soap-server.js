const soap = require('soap');
const http = require('http');
const fs = require('fs');

// Read the WSDL file
var wsdl = fs.readFileSync('denocan.wsdl', 'utf8');


const service = {
    MyService: {
      MyServicePort: {
        Add: function(args) {
          const { a, b } = args;
          return { result: 5555 };
        },
        Substract: function(args) {
            const { a, b } = args;
            return { result: a - b };
          },
        Multiply: function(args) {
            const { a, b } = args;
            return { result: a * b };
          }
      }
    }
  };

  // Create the HTTP server
  const server = http.createServer(function(request, response) {
    if (request.url === '/?wsdl' || request.url === '/denocan?wsdl' || request.url === '/zort?wsdl') {
      response.writeHead(200, {'Content-Type': 'text/xml'});
      response.end(wsdl);
      return;
  }
  else {
    response.statusCode = 404;  
    response.end("404: Not Found");
    if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            console.log('Request Body:', body);
        });
    }
  }
  });

  // Middleware to log every request
function logRequest(req, res, next) {
    console.log(`Received request for ${req.url}`);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log('Request Body:', body);
        next();
    });
}
// Apply the middleware to the server
server.on('request', (req, res) => {
    logRequest(req, res, () => {
        
    });
});
  
  // Create the SOAP server
  soap.listen(server, '/denocan', service, wsdl);
  soap.listen(server, '/zort', service, wsdl);
  
  // Start the server
  server.listen(8000, () => {
    console.log("SOAP service is running at http://localhost:8000/denocan");
  });


