module.exports = async(req, res)=> {
    try{
      req.admin.tokens = req.admin.tokens.filter((token) => {
        return token.token !== req.token
      })
      await req.admin.save()
  
      res.send()
    }catch(e){
      res.status(500)
    }
}