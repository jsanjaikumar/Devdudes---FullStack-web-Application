# DEvTinder api list

# AuthRouter
POST / signup
POST / login
POST /logout

# profileRouter
GET/profile/view
PATCH/profile/edit
PATCH/profile/password

# CONNECTIONSRouter
POST/request/send/:status/:userId
POST/request/review/:status/:requestId

# USERRouter
GET/user/connections
GET/user/request/received
GET/user/feed - gets the all user from the app

# nginx server set up imp


        server_name 13.49.238.155;

        location /api/ {
                proxy_pass http://localhost:3000/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

