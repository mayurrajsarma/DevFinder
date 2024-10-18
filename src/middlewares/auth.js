const userAuth = async (req,res,next)=> {
    //Read the token from the req
    const cookie = req.cookies ;
    const {token} = cookie ;
}