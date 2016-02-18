var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
dotenv.load();
var db = require('monk')(process.env.MONGOLAB_URI);
var posts = db.get('blog-posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  posts.find({}, function(err, blogPosts) {
    res.render('index', {
      blogPosts: blogPosts
    });
  });
});

router.get('/show/:id', function(req, res, next) {
  posts.find({_id: req.params.id}, function(err, thePost) {
    res.render('onePost', {post: thePost[0]});
  });
});

router.get('/edit/:id', function(req, res, next) {
  posts.find({_id: req.params.id}, function(err, thePost) {
    res.render('editPost', {post: thePost[0]});
  });
});

router.post('/edit/:id', function(req, res, next) {
  if (req.body.backgroundURL == '') {
    req.body.backgroundURL = '/images/concrete_seamless.png';
    req.body.darkBackground = false;
  }
  posts.update({_id: req.params.id}, {
    title: req.body.title,
    bgURL: req.body.backgroundURL || '',
    darkBG: req.body.darkBackground || false,
    excerpt: req.body.excerpt,
    body: req.body.postBody,
    comments: []
  });
  res.redirect('/show/' + req.params.id);
});
router.get('/delete/:id', function(req, res, next) {
  posts.remove({_id: req.params.id}, function(err) {
    res.redirect('/');
  });
});
router.get('/create', function(req, res, next) {
  res.render('create');
});

router.post('/create', function(req, res, next) {
  if (req.body.backgroundURL == '') {
    req.body.backgroundURL = '/images/concrete_seamless.png';
    req.body.darkBackground = false;
  }
  console.log(req.body.backgroundURL);
  posts.insert({
    title: req.body.title,
    bgURL: req.body.backgroundURL || '',
    darkBG: req.body.darkBackground || false,
    excerpt: req.body.excerpt,
    body: req.body.postBody,
    comments: []
  });
  res.redirect('/');
});

module.exports = router;
