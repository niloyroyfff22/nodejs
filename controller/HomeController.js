const { getUsers, updateAmount, getUserById } = require('../model/db');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const os = require('os');


exports.HomePage = async (req, res) => {
  
  try {
    // Get all users
    const users = await getUsers();

    // Get Accept header
    const acceptHeader = req.headers.accept;

    // Find current logged-in user data
    let data = null;
    if (req.session.user) {
      data = users.find(u => u.id === req.session.user.id);
    }

    // Example: update user amount (commented out)
    /*
    const user = await getUserById(req.session.user.id);
    const newAmount = user.Amount + 500;
    await updateAmount(user.id, newAmount);
    */

    // Set locals
    res.locals.kk = 'TK';

    // If JSON requested, return JSON
    if (acceptHeader === 'application/json') {
      return res.json(data);
    }

    // Execute shell command to get Node.js architecture
    const { stdout } = await execPromise('php -v');
    //console.log('Output:', stdout.trim());
    //console.log(chalk.red.bold('❌ Error!', stdout.trim()));


    // Render the view
    res.render('index', {
      title: 'HOME PAGE',
      data,
      nodeVersion: stdout.trim(),
      showSplash: true
    });
  } catch (err) {
    console.error('Exec error:', err);
    res.render('index', {
      title: 'HOME PAGE',
      data: null,
      nodeVersion: 'Error',
      showSplash: true
    });
  }
};