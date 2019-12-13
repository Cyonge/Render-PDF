const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');



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
                    'profile': username,
                    'profilePic': res[0].data.avatar_url,
                    'location': res[0].data.location,
                    'html': res[0].data.html_url,
                    'blog': res[0].data.blog,
                    'repos': res[0].data.public_repos,
                    'followers': res[0].data.followers,
                    'following': res[0].data.following,

                };
                
                let stargazers = 0;
                res[1].data.forEach(y => stargazers += y.stargazers_count);

                function makeHtml(res) {
                    return `
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
                            <h1 class="display-4">Hi, my name is Christian Yonge!</h1>
                            <p class="lead">I write code and teach people how to code!</p>
                            <p class="lead">I am from ${pdfInfo.location}</p>
                            <a href="https://github.com/Cyonge">
                            <img src="${pdfInfo.profilePic}" alt="Profile Picture" class="img-thumbnail" 
                            style = 
                                "border-radius: 50%;
                                height : 200px; 
                                width : 200px;
                                border: 8px solid yellow;
                                box-shadow: 10px 5px 5px black;
                                margin: 30px;
                                "></a>
                            <hr class="my-4">
                            
                            <h3 class="info">Additonal Details Below:</h3>
                            <ul class="list-group">
                                <li class="list-group-item">Github Username: ${username}</li>
                                <li class="list-group-item">Blog: ${pdfInfo.blog}</li>
                                <li class="list-group-item">Profile: ${pdfInfo.html}</li>
                                <li class="list-group-item"># of Repos: ${pdfInfo.repos}</li>
                                <li class="list-group-item">Github Stars: ${stargazers}</li>
                                <li class="list-group-item">Followers: ${pdfInfo.followers}</li>
                                <li class="list-group-item">Following: ${pdfInfo.following}</li>
                                

                            </ul>
                            <hr class="my-4">
                            <!-- This line below would link to contact page -->
                            <a class="btn btn-primary btn-lg" href="#" role="button">Contact Me</a>
                        </div>
                        
                    </body>
                    
                    </html>
                    `;

                }

                console.log(stargazers)

                console.log(res);
                console.log(pdfInfo);


                


                // get rid of 'options' here +==================================================
                pdf.create(makeHtml(res)).toFile('Resume.pdf', function (err, res) {
                    if (err) return console.log(err);
                    console.log(res); // { filename: '/app/businesscard.pdf' }
                });





            })
            .catch(function (err) {
                console.log(err);



            });
    });