const Users = require('../users/users-model'); //eslint-disable-line
const Posts = require('../posts/posts-model'); //eslint-disable-line


function logger(req, res, next) {
  // DO YOUR MAGIC
  const timeStamp = Date.now()
  console.log(req.method)
  console.log(req.url)
  console.log(timeStamp)
  next()
}

const validateUserId = async (req, res, next) => {
  // DO YOUR MAGIC
  try{
    const { id } = req.params
    const user = await Users.getById(id)
      if(user){
        req.user = user
        next()
      } else{
        next({
          status: 404,
          message: `user not found`,
        })
      }
  }catch (err) {
    next(err)
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.name){
    next({
      status: 400,
      message: `missing required name field`,
    })
  }else{
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text){
    next({
      status: 400,
      message: 'missing required text field'
    })
  }else{
    next()
  }
}

const notFound = (req, res, next) => {
  res.status(404).json({
    message: 'not found, sorry!'
  })
}

const errorHandling = (err, req, res, next) => { // eslint-disable-line
  const status = err.status || 500
  res.status(status).json({
    message: err.message,
  })
}


module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  notFound,
  errorHandling
}
// do not forget to expose these functions to other modules
