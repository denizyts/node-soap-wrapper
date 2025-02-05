const SoapWrapper = require("./SoapWrapper");


wrapperObj = new SoapWrapper("denoService");



function add(a , b ) {
    console.log("inside Add func: " + a + " " + b);
    return { result: a + b };
}
function substract(a , b) {
    return { result: a - b };
}
function multiply(a , b) {
    console.log("Multiply");
    return { result: a * b };
}


//PASS THE PARAMETER TYPES.  !!!!!! int, string !!!!!!
//IF YOU DO NOT PASS THE PARAMETER TYPES, IT WILL BE STRING BY DEFAULT. 
wrapperObj.addOperation("Add", add , {a: "int" , b: "int"});
wrapperObj.addOperation("Substract", substract , {a: "int" , b: "int"});
wrapperObj.addOperation("Multiply", multiply , {a: "int" , b: "int"});

wrapperObj.createServer(8000 , "http://localhost:8000/denocan");





