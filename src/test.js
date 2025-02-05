
const SoapWrapper = require("./SoapWrapper");
const functions = require("./functions");

wrapperObj = new SoapWrapper("denoService");


functionsObj = new functions();


//PASS THE PARAMETER TYPES.  !!!!!! int, string !!!!!!
//IF YOU DO NOT PASS THE PARAMETER TYPES, IT WILL BE STRING BY DEFAULT. 
wrapperObj.addOperation("Add", functionsObj.add , {a: "int" , b: "int"});
wrapperObj.addOperation("Substract", functionsObj.substract , {a: "int" , b: "int"});
wrapperObj.addOperation("Multiply", functionsObj.multiply , {a: "int" , b: "int"});

wrapperObj.createServer(8000 , "http://localhost:8000/denocan");

let service = wrapperObj.createServices('http://localhost:8000/denocan');

//CREATE NEW SERVERS WITH YOUR SERVICES DESIGN IT.
let wsdl = wrapperObj.wsdl

//console.log(wsdl);


