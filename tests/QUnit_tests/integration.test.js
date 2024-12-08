const baseUrl = 'http://localhost:3030/';
let user = {
    email: "",
    password: "123456"
};


let token = "";
let userId = "";
let postCard=
{   
    age : "2 years",
    name : "",
    breed : "",
    image : "/images/cat-create.jpg",
    weight  : "2 kg" 
       
}
let lastCreatedPostCardId="";
let lastCreatedOn=''
QUnit.config.reorder = false;

QUnit.module("User functionalities", () => {
    QUnit.test("Registration", async (assert) => {
        let path = 'users/register';

        let random = Math.floor(Math.random() * 10000)
        let email = `Roni${random}@abv.bg`;

        user.email = email;

        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'
             },
            body : JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json)

        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected mail");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        token = json['accessToken']; 
        userId = json['_id'];
        sessionStorage.setItem('book-user', JSON.stringify(user));
    });
    QUnit.test("Login", async (assert) => {
        let path = 'users/login';
        email=user.email

        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'

             },
            body : JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        
        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected mail");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        userId = json['_id'];
        token = json['accessToken'];
        sessionStorage.setItem('book-user', JSON.stringify(user));
       
    });
});
QUnit.module("CRUD", () => {
    QUnit.test("Get All Postcards", async (assert) => {
        let path = 'data/pets';
        let queryParam = '?sortBy=_createdOn%20desc&distinct=name'; 
        
        let response = await fetch(baseUrl + path + queryParam);

        assert.ok(response.ok, "successful response");

        let jsonData = await response.json();
        console.log(jsonData);
        assert.ok(Array.isArray(jsonData), "response is array");

        jsonData.forEach(json => {
  
            assert.ok(json.hasOwnProperty('age'), 'Property "age" exists');
            assert.strictEqual(typeof json.age, 'string', 'Property "age" is a string');
       

            assert.ok(json.hasOwnProperty('breed'), 'Property "breed" exists');
            assert.strictEqual(typeof json.breed, 'string', 'Property "breed" is a string');
    
            assert.ok(json.hasOwnProperty('image'), 'Property "image" exists');
            assert.strictEqual(typeof json.image, 'string', 'Property "image" is a string');
    
            assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
            assert.strictEqual(typeof json.name, 'string', 'Property "name" is a string');

            assert.ok(json.hasOwnProperty('weight'), 'Property "weight" exists');
            assert.strictEqual(typeof json.weight, 'string', 'Property "weight" is a string');
    
            assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
            assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is a number');
    
            assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
            assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');
    
    
            assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
            assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is a string');
        });
      
        
    })

       
    
    QUnit.test("Create PostCard Testing ", async (assert) => {
     
        let path = 'data/pets';

        let random = Math.floor(Math.random() * 100000);

        postCard.name = `Random postcard name_${random}`;
        postCard.breed = `Some breed ${random}`;

        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body : JSON.stringify(postCard)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        
        lastCreatedPostCardId = json._id;
        lastCreatedOn=json._createdOn;
        assert.ok(json.hasOwnProperty('age'), 'Property "age" exists');
        assert.strictEqual(typeof json.age, 'string', 'Property "age" is a string');
        assert.strictEqual(json.age, postCard.age, 'Property "age" has the correct value');
   

        assert.ok(json.hasOwnProperty('breed'), 'Property "breed" exists');
        assert.strictEqual(typeof json.breed, 'string', 'Property "breed" is a string');
        assert.strictEqual(json.breed, postCard.breed, 'Property "breed" has the correct value');


        assert.ok(json.hasOwnProperty('image'), 'Property "image" exists');
        assert.strictEqual(typeof json.image, 'string', 'Property "image" is a string');
        assert.strictEqual(json.image, postCard.image, 'Property "image" has the correct value');

        assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
        assert.strictEqual(typeof json.name, 'string', 'Property "name" is a string');
        assert.strictEqual(json.name, postCard.name, 'Property "name" has the correct value ');


        assert.ok(json.hasOwnProperty('weight'), 'Property "weight" exists');
        assert.strictEqual(typeof json.weight, 'string', 'Property "weight" is a string');
        assert.strictEqual(json.weight, postCard.weight, 'Property "weight" has the correct value');


        assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is a number');
        assert.strictEqual(json._createdOn,lastCreatedOn, 'Property "_createdOn" has the correct value');


        assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');
        assert.strictEqual(json._id,lastCreatedPostCardId, 'Property "_id" has the correct value');

        
        assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is a string');
        assert.strictEqual(json._ownerId,userId, 'Property "_ownerId" has the correct value');



    });
    QUnit.test("Edit PostCard Testing  ", async (assert) => {
       
        let path = 'data/pets';
        let queryParam=lastCreatedPostCardId
        let random = Math.floor(Math.random() * 100000);

        postCard.name = `Edited postcard name_${random}`;
       

        let response = await fetch(baseUrl + path + `/${queryParam}`,{
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body : JSON.stringify(postCard)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
       
        assert.ok(json.hasOwnProperty('age'), 'Property "age" exists');
        assert.strictEqual(typeof json.age, 'string', 'Property "age" is a string');
   

        assert.ok(json.hasOwnProperty('breed'), 'Property "breed" exists');
        assert.strictEqual(typeof json.breed, 'string', 'Property "breed" is a string');

        assert.ok(json.hasOwnProperty('image'), 'Property "image" exists');
        assert.strictEqual(typeof json.image, 'string', 'Property "image" is a string');
        assert.strictEqual(json.image, postCard.image, 'Property "image" has the correct value');

        assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
        assert.strictEqual(typeof json.name, 'string', 'Property "name" is a string');
        assert.strictEqual(json.name, postCard.name, 'Property "name" has the correct value ');


        assert.ok(json.hasOwnProperty('weight'), 'Property "weight" exists');
        assert.strictEqual(typeof json.weight, 'string', 'Property "weight" is a string');
        assert.strictEqual(json.weight, postCard.weight, 'Property "weight" has the correct value');


        assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is a number');
        assert.strictEqual(json._createdOn,lastCreatedOn, 'Property "_createdOn" has the correct value');


        assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');
        assert.strictEqual(json._id,lastCreatedPostCardId, 'Property "_id" has the correct value');

        
        assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is a string');
        assert.strictEqual(json._ownerId,userId, 'Property "_ownerId" has the correct value');


    });
    QUnit.test("Delete PostCard Testing  ", async (assert) => {
  
        let path = 'data/pets';
        let queryParam=lastCreatedPostCardId
       
        let response = await fetch(baseUrl + path + `/${queryParam}`,{
            method : 'DELETE',
            headers : {
                
                'X-Authorization' : token
            }
        });

        assert.ok(response.ok, "successful response");

    });
});
