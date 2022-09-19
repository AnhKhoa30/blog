const { render } = require('node-sass');
const Course = require('../models/Course')
const {mutipleMongooseToObject} =require('../../util/mongoose')

class MeController{
    
    
    //GET//stored/course
    storedcourse(req,res,next){
     
        let courseQuery = Course.find({});
        if(req.query.hasOwnProperty('_sort')){

        courseQuery = courseQuery.sort({
            [req.query.column]:req.query.type
        })

        }
        Promise.all([courseQuery,Course.countDocumentsDeleted()])
        .then(([course,countDeleted])=>res.render('me/stored-course',{
            countDeleted,
            course: mutipleMongooseToObject(course)
        }) 
        )
        .catch(next)
        
       
    }
    trashcourse(req,res,next){
        Course.findDeleted({})
        .then(course=>
            res.render('me/trash-course',{
            course: mutipleMongooseToObject(course)
        }))
        .catch(next);
    }
}

module.exports=new MeController;
