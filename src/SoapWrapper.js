const soap = require('soap');
const http = require('http');


/*
author: denocan, denizyts
*/ 

//WE WILL GENERATE THE WSDL FILE.
class SoapWrapper {
    constructor(serviceName = 'denoService' , portName = 'denoServicePort' , tns = 'http://example.com/soap' , bindingName = 'denoServiceBinding')  {
        this.serviceName = serviceName;
        this.portName = portName;
        this.tns = tns;
        this.bindingName = bindingName;
    }

    addOperation(operationName, assignFunction, param_types = {} ) {
        if (!this.operations) {
            this.operations = [];
        }
        if (!this.messages) {
            this.messages = [];
        }
        if (!this.parameters) {
            this.parameters = [];
        }
        this.operations.push({
            operationName: operationName,
            assignFunction: assignFunction
        });
        this.messages.push({
            messageRequestName: operationName + 'Request',
            messageResponseName: operationName + 'Response'
        });

        //COPILOT 
        const functionString = assignFunction.toString();
        const parameterMatch = functionString.match(/\(([^)]*)\)/);
        var parameters = parameterMatch ? parameterMatch[1].split(',').map(param => param.trim()) : [];

        console.log('Parameters:', parameters); 
        console.log('Param Types:', param_types);

        parameters = parameters.map(param => param.replace(/[{}]/g, ''));   //remove curly braces from parameters.

        console.log('Parameters:', parameters); 

        const paramsAndTypes = parameters
            .filter(param => param_types[param]) // Filter out parameters without a type
            .map(param => ({
            name: param,
            type: param_types[param]
            }));
        // const paramsAndTypes = Object.keys(parameters).map((param) => ({
        //     name: parameters[param],
        //     type: param_types[parameters[param]] || 'string' // Use paramTypes if provided, default to 'string'
        // }));
    
        this.parameters.push({
            operationName: operationName,
            paramsAndTypes: paramsAndTypes
        });


       //DENOCAN DEBUG ICIN COK FAYDALI. 
       // console.log(JSON.stringify(this.parameters, null, 2));

        
    }   

    
     wsdlGenerator(location){ 

        this.wsdl =   `<definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
             xmlns:tns="${this.tns}"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
             name= "${this.serviceName}"
             targetNamespace="${this.tns}">    
             `;


        //add types, DONT FORGET TO CLOSE THE SCHEMA AND TYPETAG.
        this.wsdl += `<types>
                <xsd:schema targetNamespace="${this.tns}"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:ns0="${this.tns}">`; 


        this.operations.forEach((op) => {
            this.wsdl += `<xsd:complexType name="${op.operationName}">
            <xsd:sequence>`;
            this.parameters.forEach((param) => {
                if (param.operationName === op.operationName) {
                    param.paramsAndTypes.forEach((p) => {
                        this.wsdl += `<xsd:element name="${p.name}" type="xsd:${p.type}" />`;
                    });
                }
            });
            this.wsdl += `</xsd:sequence>
            </xsd:complexType>`;

        });        

        this.operations.forEach((op) => {
            this.wsdl += `<xsd:element name="${op.operationName}Request" type="ns0:${op.operationName}" />
            <xsd:element name="${op.operationName}Response" type="ns0:${op.operationName}" />`;
        });

        //close types
        this.wsdl += `</xsd:schema>
        </types>`;


        //add messages  
        this.messages.forEach((message) => {
            this.wsdl += `<message name="${message.messageRequestName}">
            <part name="parameters" element="tns:${message.messageRequestName}" />
            </message>
            <message name="${message.messageResponseName}">
            <part name="parameters" element="tns:${message.messageResponseName}" />
            </message>`;
        });

        //add portType
        this.wsdl += `<portType name="${this.portName}">`;

        //add operations
        this.operations.forEach((op) => {
            this.wsdl += `<operation name="${op.operationName}">
            <input message="tns:${op.operationName}Request" />
            <output message="tns:${op.operationName}Response" />
            </operation>`;
        });

        this.wsdl += `</portType>`;

        //add binding
        this.wsdl += `<binding name="${this.bindingName}" type="tns:${this.portName}">`;
        this.wsdl += `<soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http" />`;

        //Empty Soap Actions.
        this.operations.forEach((op) => {
            this.wsdl += `<operation name="${op.operationName}">
            <soap:operation soapAction="" style="document" />
            <input> <soap:body use="literal" /> </input>
            <output> <soap:body use="literal" /> </output>
            </operation>`;
        });

        this.wsdl += `</binding>`;

        //add service
        this.wsdl += `<service name="${this.serviceName}">`;
        this.wsdl += `<port name="${this.portName}" binding="tns:${this.bindingName}">`;
        this.wsdl += `<soap:address location="${location}" />`;
        this.wsdl += `</port>`;
        this.wsdl += `</service>`;
        this.wsdl += `</definitions>`;

        this.wsdl = this.wsdl.replace('{' , '');
        this.wsdl = this.wsdl.replace('}' , '');
        //console.log(this.wsdl);
    }

    createServer(port = 8000 , location = "http://localhost:8000/denizyts") {

        if (port != location.split(":")[2].split("/")[0]) { 
            throw new Error("Port and location must be the same. Please check your port and location.");
        }

        if (!this.operations || this.operations.length === 0) {
            throw new Error("No operations defined. Please add operations using addOperation().");
        }

        //generate wsdl before creating the server !!!
        this.wsdlGenerator(location); 
    
        // Construct the service object dynamically
        const service = {
            [this.serviceName]: {
                [this.portName]: {}
            }
        };
    
        /* For design choice of mkulali, denocan changed his own code and modified it for requirements.
        This part of the wrapper can be design and okey for overriding but be careful and
        inspect other parts of SoapWrapper class. */
        this.operations.forEach(op => {
            service[this.serviceName][this.portName][op.operationName] = (args, callback) => {
                // Convert the operation function string back to a function
                //const operationFunction = eval(`(${op.assignFunction})`);
                
                try {
                    console.log('Operation:', op.operationName);   
                    console.log(args);
                    //operationFunction(1,2);    //this is ok.

                    //console.log('Operation Function:', operationFunction);

                    const result = op.assignFunction(...Object.values(args) , 1 , 2, 3);
                    

                    //console.log('Result:', result);
                    //const result = operationFunction(args);
                    callback(null, result); // Success callback
                } catch (err) {
                    callback(err); // Error callback
                }
            };
        });

        this.service = service;   //to get service object from outside of the class. denocan logic.
        //console.log(service);
        

        const server = http.createServer((request, response) => {
            
            if(request.url === '/author') {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end('Author: denocan, denizyts');
                return;
            }
            if (request.url === '/?wsdl' || request.url === '/wsdl' ) {
              response.writeHead(200, {'Content-Type': 'text/xml'});
              response.end(this.wsdl);
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
        
        server.on('request', (req, res) => {
            logRequest(req, res, () => {
            });
        });
          

          //error could be occur related to the line below.ERROR COULD BE OCCUR !!!!!! DENOCAN !!!!!! 
          soap.listen(server, '/'+location.split('/')[3], service, this.wsdl);
          
          //console.log('/'+location.split('/')[3]);   //print the listened location. 

          server.listen(port, () => {
            console.log(`SOAP service is running at ` + location);
          });

          return server;
    }

    createServices(location = 'http://localhost:8000/denizyts') {
         //generate wsdl before creating the server !!!
         this.wsdlGenerator(location); 
    
         // Construct the service object dynamically
         const service = {
             [this.serviceName]: {
                 [this.portName]: {}
             }
         };
     
         this.operations.forEach(op => {
             service[this.serviceName][this.portName][op.operationName] = async (args, callback,headers, req) => {
                 // Convert the operation function string back to a function
                 //const operationFunction = eval(`(${op.assignFunction})`);
                 
                 try {
                     console.log('Operation:', op.operationName);   
                     console.log(args);
                     //operationFunction(1,2);    //this is ok.
 
                     //console.log('Operation Function:', operationFunction);
 
                     const result = await op.assignFunction(args , req);
                     
 
                     console.log('Result:', result);
                     //const result = operationFunction(args);
                     callback(null, result); // Success callback
                 } catch (err) {
                     callback(err); // Error callback
                 }
             };
         });
 
         this.service = service;   //to get service object from outside of the class. denocan logic.
         //console.log(service);
         return service;
    }

}


module.exports = SoapWrapper;


