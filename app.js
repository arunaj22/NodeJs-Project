var express = require("express"); // this line calls the exress framework to action
// never write abything above this express call line.
var app = express();

app.set("view engine", "ejs"); // set default view engine

var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var contact = require("./model/contact.json");// this declares the content of the contact.json file as a variable called contact
var product = require("./model/product.json");

//Call the access to the views folder  and allow content to be rendered
app.use(express.static("views"));

//Call the access to the script folder  and allow content to be rendered
app.use(express.static("script"));

//Call the access to the imager folder  and allow content to be render images
app.use(express.static("images"));

//Get call for the index page or first message ob browser
app.get('/', function(req,res){ // this line calls get request on the / URL of the application
//  setting up a message to us on browser 
    //res.send("Hello January Class") ;// we will send a string response to the browser
    res.render("index");

    console.log("The message was sent and you made an app");
});

/----------From Her JSON Data Starts-------------------//
//route to Contacts 'About us'page
app.get('/contacts', function(req,res){ // this line calls get request on the / URL of the application

    res.render("contacts", {contact});

    console.log("This is contacts page route");
});

app.get('/products', function(req, res){
      res.render("products", {product});
     console.log("Welcome to procuct page")

});

// =####### Functions to add a contact #############
app.get('/add', function(req, res){
      res.render("add")
     console.log("Welcome to leave comment page")

});
//app.post function for finding maximum jsaon id and adding 1 to it and return max
app.post('/add', function(req,res){
    // Write a function to find the max id in my JSON file

    function getMax(contacts, id) {
        var max
        for (var i=0; i<contacts.length; i++) {
            if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
            max = contacts[i];
        }
        console.log("The max id is " + max)
        return max;
    }
    maxCid = getMax(contact, "id")

   var newId = maxCid.id + 1; // make a new variable for id which is 1 larger than the current max

    console.log("New id is: " + newId);
    var json = JSON.stringify(contact) // we tell the application to get our JSON readdy to modify
                            // Now we will create a new JSON object
    var contactsx = {
        id: newId,
        name: req.body.name,
        Comment: req.body.email,
        email: req.body.comment
    }
// Now we push the data back to the JSON file
    fs.readFile('./model/contact.json', 'utf8', function readfileCallback(err){
        if(err){
            throw(err)
        } else {
          contact.push(contactsx)  // add the new contact to the JSON file
          json = JSON.stringify(contact, null, 4) // structure the new data nicely in the JSON file
          fs.writeFile('./model/contact.json', json, 'utf8')
        }
    })

    res.redirect('/contacts')
});
////// ########## Function to delete a contact ####
app.get('/deletecontact/:id', function(req,res){

     var json = JSON.stringify(contact);
     // Get the id we want to delete from the URL parameter 
     var keyToFind = parseInt(req.params.id); 

    var data = contact // Declare the json file as a variable called data

    // lets map the data and find the information we need
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind)

    // JavaScript allows us to splice our JSON data
    contact.splice(index, 1); // delete only one item from the position of the index variable above

          json = JSON.stringify(contact, null, 4) // structure the new data nicely in the JSON file
          fs.writeFile('./model/contact.json', json, 'utf8')

console.log("Ha Ha ....... its gone!")    
res.redirect('/contacts')

});




 // **** Never write abything below this line****   
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Well done! Your first app is now live");
});