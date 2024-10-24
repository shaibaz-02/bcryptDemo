const express =require('express')
const app= express()
const path=require('path')
const User=require('./models/user')
const bcrypt=require('bcrypt')
const session=require('express-session');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(session({secret:'nai bolte aapku secret'}))
const mongoose=require('mongoose')
//mongoose.connect('mongodb://127.1.0.0:27017/loginDemo')
mongoose.connect('mongodb://127.0.0.1:27017/loginDemo')
.then(data=>{
    console.log("connection is on")
})
.catch(err =>{
    console.log("oh no, their is a error")
    console.log(err)
})
app.get('/',(req,res)=>{
    res.send("this is the home page")
})
app.get('/register',(req,res)=>{
    res.render('register')
})
const Require=(req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next();
}
app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash=await bcrypt.hash(password,12);
    const user = new User({ username, password:hash })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({username});
    const validpassword= await bcrypt.compare(password,foundUser.password);
    if (validpassword) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
        // res.send("mammmuu welcome")
    }
    else {
        res.redirect('/login')
        // res.send("oops,try again")
    }
})
app.post('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})
app.get('/secret',Require,(req,res)=>{
    res.render('secret')
})
app.listen(8000,()=>{
    console.log("listening to the port 8000");
})