const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars').engine;
const app = express();
const SortMiddleware = require('./app/middlewares/SortMiddleware')
const port = 3000;
const route = require('./routes')
const db = require('./config/db')
db.connect()



app.use(express.static(path.join(__dirname,'public')))
// Routes init

app.use(express.urlencoded({
  extended:true
}));
app.use(express.json());
app.use(methodOverride('_method'));
//custom middlewares
app.use(SortMiddleware);
route(app);



// HTTP logger
app.use(morgan('combined'));


// Template engine
app.engine('hbs', handlebars({
  extname:'.hbs',
  helpers:{
    sum:(a,b)=>a+b,
    sortable:(field,sort)=>{
      const sortType = field === sort.column ? sort.type :'default'
      const icons={
        asc:'bi bi-sort-down',
        default:'bi bi-arrow-down-up',
        desc:'bi bi-sort-down-alt',
      }
      const types={
        default:'desc',
        asc:'desc',
        desc:'asc',
      }
      const icon= icons[sortType];
      const type = types[sortType];

      return`<a href="?_sort&column=${field}&type=${type}">
      <i class="${icon}"></i>
      </a>`
    }
  }

}),
)



app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, 'resources','views'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})