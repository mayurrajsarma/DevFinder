## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## RequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/received/accepted/:requestId
POST /request/received/rejected/:requestId

## userRouter
GET /user/connection
GET /user/request/received
GET /user/feed - gets you the profiles of other users on platform