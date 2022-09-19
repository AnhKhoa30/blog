const { render } = require('node-sass');
const Course = require('../models/Course')
const {mongooseToObject} =require('../../util/mongoose')

class CourseController{
   

    
    //GET /course/:slug
    show(req,res,next){
        Course.findOne({slug:req.params.slug})
        .then((course) =>
res.render('course/show',{course:mongooseToObject(course)})
        )
        .catch(next);
//GET course/create
    }
    create(req,res,next){
        res.render('course/create')
    }
    //POST course/store
    store(req, res, next) {
        
        req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/maxresdefault.jpg`;
        
        const course = new Course(req.body);
        course.save()
            .then(()=> res.redirect('/me/stored/course'))
            .catch(next)
    }
    //GET/course/:id/edit
    edit(req,res,next){
        Course.findById(req.params.id)
        .then(course =>res.render('course/edit',{
        course:mongooseToObject(course)
    }))

       .catch(next);
    }
    //PUT/course/:id
    update(req,res,next){
        Course.updateOne({_id:req.params.id},req.body)
        .then(() =>res.redirect('/me/stored/course'))
        .catch(next)
    }
    // DETELE/course/:id
    delete(req,res,next){
        Course.delete({_id:req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next);

    }
    // DELETE /course/:id/force
    forcedelete(req,res,next){
        Course.deleteOne({_id:req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next);
    }
    
    // PATH /course/:id/restore
    restore(req,res,next){
        Course.restore({_id:req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next);
    }
// POST /course/handle-form-actions
handleFormActions(req,res,next){
    switch(req.body.action){
        case'delete':
        Course.delete({_id:{$in:req.body.coursesId}})
        .then(()=>res.redirect('back'))
        .catch(next);
        break;
        case'forceDelete':
        Course.deleteMany({_id:{$in:req.body.coursesId}})
        .then(() => res.redirect('back'))
        .catch(next)
        break;
        case'restores':
        Course.restore({_id:{$in:req.body.coursesId}})
        .then(()=>res.redirect('back'))
        .catch(next)
        break;
        
        default:
            res.json({message:'Action is invaled'})
    }
    
}
   
}

module.exports=new CourseController;
