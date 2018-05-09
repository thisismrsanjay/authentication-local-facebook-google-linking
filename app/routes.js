const User = require('../app/models/user');
const bcrypt  = require('bcryptjs'); 

module.exports = function(app,passport){
    app.get('/',(req,res)=>{
        res.render('index.ejs');
    })
    app.get('/login',(req,res)=>{
        res.render('login.ejs',{message:req.flash('loginMessage')})
    })
    app.post('/login', passport.authenticate('local',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    }))
    app.get('/signup',(req,res)=>{
        res.render('signup.ejs',{message:req.flash('signupMessage')})
    });
    app.post('/signup', (req,res)=>{
        User.findOne({
            'local.email':req.body.email
        },(err,result)=>{
            if (err)throw err
            if(!result){
                
                const newUser = new User()
                newUser.local.email=req.body.email;
                newUser.local.password=req.body.password;
                
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.local.password,salt,function(err,hash){
                        
                        
                        newUser.local.password= hash;
                        newUser.save((err)=>{
                            if(err)throw err;
                            else{
                                res.redirect('/login');
                            }
                        })
                    })
                })
            }else{
                res.send('users/login');
            }
        })
    });
    app.get('/profile', (req,res)=>{
        res.render('profile.ejs',{
            user:req.user
        })
    })
    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/');
    })
}
