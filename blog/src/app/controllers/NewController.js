class NewController{
    //GET /news
    index(req,res){
        res.render('news');

    }
    show(req,res){
        res.send('NewsDTAI');
    }
}
module.exports=new NewController;
