const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");
const convertFactory = require('electron-html-to');


const writeFileAsync = util.promisify(fs.writeFile);



inquirer
    .prompt([
        {
            name: "username",
            message: "What is your github username?"
        },
        {
            name: "color",
            message: "What is your favorite color?"
        },

    ])
    .then(function ({ username }) {

        // these are the URL variable for all required github information
        const URL1 = `https://api.github.com/users/${username}`;
        const URL2 = `https://api.github.com/users/${username}/repos?per_page=100`;
        // const URL3 = ``;
        // let URL3 = `etc`

        const promise1 = axios.get(URL1);
        const promise2 = axios.get(URL2);
        // const promise3 = axios.get(URL3);
        // const promise3 = axios.get(URL3);

        Promise.all([promise1, promise2])
    .then(function (res) {
        const pdfInfo = {
            "profile" : res[0].data.html_url,
            "profilePic" : res[0].data.avatar_url,

            
        };
        let stargazers = 0;
            res[1].data.forEach(y => stargazers += y.stargazers_count);
        console.log(stargazers)

        console.log(res);
        console.log(pdfInfo);

        var conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
          });
        

          conversion({ html: 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <title>Document</title>
            </head>
            
            <body>
                <div class="jumbotron">
                    <h1 class="display-4">Hi, my name is ${username}!</h1>
                    <p class="lead">I am from ${username}</p>
                    <hr class="my-4">
                    
            
                    <ul class="list-group">
                        <li class="list-group-item">Github Username: ${username}</li>
                        <li class="list-group-item">Linkedin Link: ${res.profile}</li>
                        <li class="list-group-item">Ima slam some ${res.profilePic}</li>
                    </ul>
                    <hr class="my-4">
                    <!-- This line below would link to contact page -->
                    <a class="btn btn-primary btn-lg" href="#" role="button">Contact Me</a>
                </div>
                <div>
                <h2>Github Stars:</h2>
                <h2>${stargazers}</h2>
            </div>
            </body>
            
            </html>
            `
        }, function(err, PDF) {
                if (err) {
                  return console.error(err);
                }
               
                console.log(PDF.numberOfPages);
                console.log(PDF.logs);
                PDF.stream.pipe(fs.createWriteStream('.pdf'));
              });;
             
       
        

        })
    .catch(function(err) {
        console.log(err);

        

            });
        });

    // });



// const generateHTML = () => {


// }


// * Profile image 
// *  
// * Links to the following:
//   * User location via Google Maps
//   * User GitHub profile
//   * User blog
// * User bio
// * Number of public repositories 
// * Number of followers
// * Number of GitHub stars
// * Number of users following