# **FetchServer**


### **Hello team members at Fetch Rewards! Within this folder I have created the server requested. I did add some pug files to help make the data more readable on the browser, but no CSS was added so it is a pretty simple application. But very usable when following the simple instructions in this README.**

## ***Tech Specs***

1. Written in Javascript using Node
1. Dependencies and why :
    * Pug - to render information to the browser
    * Express - help create our server

## ***How to use***

1. Once you have downloaded the repository you will want to navigate to the file location in your terminal
1. Run "npm install" to install all dependencies
1. Run "node fetchServer.js" to start the server
1. Then within your web browser you will navigate to "localhost:5000"
1. The landing page on this site is a list of all payers and points for each set of data and utilizes the GET HTTP request
    * *If you look in your terminall you will see an object with the expected format for the response*
1. On this site you can navigate to the different sections to see the full functionality of the server per the assigment
    1. To add a new payer and points, select: "Add Payer", enter data and submit
        * this will redirect you back to the main page with the new added payer at the bottom of the list
    1. To deduct points for a the payers in order or timestamp select: "Redeem Points" and enter the amount of point you wish to use
        * this will redirect you back to the main page with the updated point values for each payer
        * *The deducted points from each payer affect can be viewed in the terminal as the expected response.*


### **I know this was brief assessment, but I enjoyed doing it, please let me know if you have any questions or trouble getting the application to run.**
