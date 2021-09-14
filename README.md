Folder structures
        routes -- contains all the routes 
        services -- cotains all the functions
        uploads  -- saves uploaded csv file
        server.js -- task1 server
        server2.js -- task2 serevr
        package.json 
        package-lock.json

prerequisites before starting server

        install node
        install mongodb and make sure it is up and running on 27017 port if not change the port to mongodb port number 
        run "npm install" in the root folder
        node server.js to start task 1 server from root folder(port number 3000) 
        node server2.js to  start task 2 server from root folder(port number 3001)
            


1. server.js apis instructions 

        a) baseURL + /upload/csv  is for uploading csv  
             add file to the form-data with key name as "file"
             post method
             
        b) baseURL + /search/single?key="username"  is for single user name search
              pass username as query params
              get method
              
        c) baseURL + /search/allData is for getting aggregated data
              get method 
              
2. serve2.js apis instructions      

     a) baseURL + /save?time=HH:MM:SS&day=tuesday&msg=goodmorning
              post method
