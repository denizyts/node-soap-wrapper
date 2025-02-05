
  # Soap-Wrapper Nodejs 📝 
  Build SOAP server quickly and without any effort. 
  Soap server building becomes more easy with this node module

  ## Get Started 🚀  
  test.js and test1.js are best documents please inscpect them and try to send request.

  # Table of contents  
1. [How to install](#Howtoinstall)  
2. [Features](#paragraph1)  
3. [Run locally](#paragraph2)  
4. [Usage](#Usage)
5. [The generated WSDL](#wsdl)
6. [Sample Request](#srequest)
7. [Sample Response](#sresponse)


  
## How to install

You can install with or clone the project
~~~javascript  
  npm i soap-wrapper
~~~  


## Features 🚀  
- No WSDL preperation. 
- No need to service definition. 
- Auto binding.
- Auto server listening    

## Run Locally  
Clone the project 

~~~bash  
  git clone https://github.com/denizyts/node-soap-wrapper
~~~

Go to the project directory  

~~~bash  
  cd node-soap-wrapper
~~~

Install dependencies  (Only soap)

~~~bash  
npm install soap
~~~

Start the server  
~~~bash  
node test.js
~~~  

## Usage 

Please inspect test.js and test1.js the usage if very simple if you 
have some functions you can add operations to wrapper object.


~~~javascript  
class Functions {
    add(a, b ) { 
        console.log("inside Add func in obj: " + a + " " + b);
        return 'anyValue';
    }
}
~~~ 

Pass your service name, port name, tns name, binding name. all of them are setted if you not pass the parameter default will be used.
~~~javascript  
wrapperObj = new SoapWrapper("denoService");
~~~  

Parameters type can be setted by passing a json object, "int" and "string" are possible. please give all the Parameters in object which are you want to pass to your function.

~~~javascript  
  wrapperObj.addOperation("Add", functionsObj.add , {a: "int" , b: "int"});
~~~  

After adding operations, call createServer pass the lcoation and port soap server will starts to listen that endpoint, if you pass different port number in params and in location a specific exception will occur.
~~~javascript  
wrapperObj.createServer(8000 , "http://localhost:8000/denocan");
~~~  

Additional Feature:

Create services after adding operations.
if you want to build your own server with additional configuraitons.
The wsdl will be generated you can use if you want. 
~~~javascript  
let service = wrapperObj.createServices('http://localhost:8000/denocan');
let wsdl = wrapperObj.wsdl
~~~  
## The Generated WSDL 🚀 

You can get the wsdl by sending post request to the base api, on local: 
http://localhost:8000/wsdl returns you wsdl.


~~~javascript
  <definitions xmlns="http://schemas.xmlsoap.org/wsdl/" 
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" 
             xmlns:tns="http://example.com/soap"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
             name= "denoService"
             targetNamespace="http://example.com/soap">
    <types>
        <xsd:schema targetNamespace="http://example.com/soap"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:ns0="http://example.com/soap">
            <xsd:complexType name="Add">
                <xsd:sequence>
                    <xsd:element name="a" type="xsd:int" />
                    <xsd:element name="b" type="xsd:int" />
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="Substract">
                <xsd:sequence>
                    <xsd:element name="a" type="xsd:int" />
                    <xsd:element name="b" type="xsd:int" />
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="Multiply">
                <xsd:sequence>
                    <xsd:element name="a" type="xsd:int" />
                    <xsd:element name="b" type="xsd:int" />
                </xsd:sequence>
            </xsd:complexType>
            <xsd:element name="AddRequest" type="ns0:Add" />
            <xsd:element name="AddResponse" type="ns0:Add" />
            <xsd:element name="SubstractRequest" type="ns0:Substract" />
            <xsd:element name="SubstractResponse" type="ns0:Substract" />
            <xsd:element name="MultiplyRequest" type="ns0:Multiply" />
            <xsd:element name="MultiplyResponse" type="ns0:Multiply" />
        </xsd:schema>
    </types>
    <message name="AddRequest">
        <part name="parameters" element="tns:AddRequest" />
    </message>
    <message name="AddResponse">
        <part name="parameters" element="tns:AddResponse" />
    </message>
    <message name="SubstractRequest">
        <part name="parameters" element="tns:SubstractRequest" />
    </message>
    <message name="SubstractResponse">
        <part name="parameters" element="tns:SubstractResponse" />
    </message>
    <message name="MultiplyRequest">
        <part name="parameters" element="tns:MultiplyRequest" />
    </message>
    <message name="MultiplyResponse">
        <part name="parameters" element="tns:MultiplyResponse" />
    </message>
    <portType name="denoServicePort">
        <operation name="Add">
            <input message="tns:AddRequest" />
            <output message="tns:AddResponse" />
        </operation>
        <operation name="Substract">
            <input message="tns:SubstractRequest" />
            <output message="tns:SubstractResponse" />
        </operation>
        <operation name="Multiply">
            <input message="tns:MultiplyRequest" />
            <output message="tns:MultiplyResponse" />
        </operation>
    </portType>
    <binding name="denoServiceBinding" type="tns:denoServicePort">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http" />
        <operation name="Add">
            <soap:operation soapAction="" style="document" />
            <input>
                <soap:body use="literal" />
            </input>
            <output>
                <soap:body use="literal" />
            </output>
        </operation>
        <operation name="Substract">
            <soap:operation soapAction="" style="document" />
            <input>
                <soap:body use="literal" />
            </input>
            <output>
                <soap:body use="literal" />
            </output>
        </operation>
        <operation name="Multiply">
            <soap:operation soapAction="" style="document" />
            <input>
                <soap:body use="literal" />
            </input>
            <output>
                <soap:body use="literal" />
            </output>
        </operation>
    </binding>
    <service name="denoService">
        <port name="denoServicePort" binding="tns:denoServiceBinding">
            <soap:address location="http://localhost:8000/denocan" />
        </port>
    </service>
</definitions>
~~~


## Sample Request

If you give the operation name as Add the request must Contain AddRequest, basically operation name + 'Request'. Please inspect the requests body.
Do not forget to put Content-Type to the header. Value is text/xml. 
~~~javascript  
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/soap">
   <soap:Body>
      <tns:AddRequest>
         <a>8</a>
         <b>8</b>
      </tns:AddRequest>
   </soap:Body>
</soap:Envelope>
~~~  


## Sample Response

Operation name is Add so response is in the AddResponse tag. 
~~~javascript
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:tns="http://example.com/soap" xmlns:ns0="http://example.com/soap">
    <soap:Body>
        <tns:AddResponse>anyValue</tns:AddResponse>
    </soap:Body>
</soap:Envelope>
~~~
## License  
[MIT](https://choosealicense.com/licenses/mit/)  
