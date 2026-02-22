const { signupm } = require('../model/SignupModel');


exports.SignUp = (req, res) => {
  res.locals.errors = req.flash('errorss')[0] || {};
  res.locals.oldInput = req.flash('oldInput')[0] || {};
  res.render('SignUp');
}

exports.SignUpPost = async (req, res) => {
  const { user, pass } = req.body;
  
  const errors = {};

  // ফাঁকা ইনপুট চেক
  if (!user || user.trim() === '') {
    errors.user = 'নাম ফিল্ড খালি রাখা যাবে না';
  }
  if (!pass || pass.trim() === '') {
    errors.pass = 'পাসওয়ার্ড ফিল্ড খালি রাখা যাবে না';
  }
  
  
  if (Object.keys(errors).length > 0) {
    req.flash('errorss', errors);
    req.flash('oldInput', req.body);
    return res.redirect('/signup');
  }
 const kk =  signupm(user, pass);
  req.session.user = kk;
  console.log(kk);
  res.redirect("/");
}