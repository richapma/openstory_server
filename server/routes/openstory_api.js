var express = require('express');
var openstory_router = express.Router();
var util = require('util');
var Scene = require('../models/scene.js');
var Openstory_store = require('../models/openstory_store.js');
var Catalog = require('../models/catalog.js');
var uuid = require('uuid');

openstory_router.get('/search_catalogs', function(req, res){
  console.log('search_catalogs');
  //if(req.isAuthenticated()){
    //req.params.search = req.params.search; //.replace(/-/g,'').toUpperCase();
    Catalog.find({'title': new RegExp('.*' + req.params.search + '.*', 'i')}, { skip: req.params.skip, limit: req.params.limit }, 
      function(err, catalogs){
        if (err)
        {
            res.send(err);
        }else
        {
          var cats = {};
          var key;
          console.log('found catalog(s):' + catalogs.length);

          for(var i=0; i<catalogs.length; i++){
            key = catalogs[i]._id;
            cats[key] = catalogs[i];
          }

          res.json(cats);
        }
      }
    );    
  //}else{
    console.log('Unauthenticated user attempted to access search_catalogs');
    res.status(401).json({
      status: true
    });
  //}
});

openstory_router.get('/search_mycatalogs', function(req, res){
  if(req.isAuthenticated()){
    req.params.search = req.params.search; //.replace(/-/g,'').toUpperCase();
    Catalog.find($and [{'title': new RegExp('.*' + req.params.search + '.*', 'i')},
      {WritePermissions: {$elemMatch: {'value': req.user.username}}}]
      , { skip: req.params.skip, limit: req.params.limit }, 
      function(err, catalogs){
        if (err)
        {
            res.send(err);
        }else
        {
          var cats = {};
          var key;
          console.log('found catalog(s):' + catalogs.length);

          for(var i=0; i<catalogs.length; i++){
            key = catalogs[i]._id;
            cats[key] = catalogs[i];
          }

          res.json(cats);
        }
      }
    );    
  }else{
    console.log('Unauthenticated user attempted to access search_catalogs');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.put('/write_catalog/:c1', function(req, res){
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/g,'').toUpperCase();
    Catalog.findById(req.params.c1, function(err, catalog) {
      if (!catalog)
      {
          catalog = new Catalog();
      }
      
      if(req.body._id == null){
        catalog._id = uuid.v1().replace(/-/g, '').toUpperCase();
      }else{
        catalog._id = req.body._id;
      }
      catalog.uidGroup = req.body._id;
      catalog.fkuidGroup = req.body.fkuidGroup;
      catalog.title = req.body.title;
      catalog.width = req.body.width;
      catalog.height = req.body.height;
      catalog.fontSize = req.body.fontSize;
      catalog.fkuidGroup_t_catalog_scene_first = req.body.fkuidGroup_t_catalog_scene_first.replace(/-/g, '').toUpperCase();
      catalog.DownloadLink  = req.body.DownloadLink;
      catalog.Description  = req.body.Description;
      catalog.YouTubeEmbedUrl = req.body.YouTubeEmbedUrl;
      catalog.ImageUrl1 = req.body.ImageUrl1;
      catalog.ImageUrl2  = req.body.ImageUrl2;
      catalog.ImageUrl3 = req.body.ImageUrl3;
      catalog.ImageUrl4  = req.body.ImageUrl4;
      catalog.ImageUrl5  = req.body.ImageUrl5;
      catalog.Hide  = req.body.Hide;
      catalog.Released = req.body.Released;
      catalog.ModReview  = req.body.ModReview;
      catalog.AgeFrom  = req.body.AgeFrom;
      catalog.AgeTo = req.body.AgeTo;
      catalog.FlagInappropriate  = req.body.FlagInappropriate;
      catalog.fkuidGroup_t_catalog_update  = req.body.fkuidGroup_t_catalog_update.replace(/-/g, '').toUpperCase();
      catalog.fkuidGroup_t_catalog_genre = req.body.fkuidGroup_t_catalog_genre.replace(/-/g, '').toUpperCase();
      catalog.WritePermissions = req.body.WritePermissions;
      catalog.RecordCurrent  = req.body.RecordCurrent;
      catalog.DateRecordCurrent = req.body.DateRecordCurrent;
      
      catalog.save(function(err) {
        if (err)
        {
            console.log("write_catalog:failed");
            console.log(err);

            res.send("write_catalog:failed");
        }else
        {
          res.status(200).json({
            status: true
          });
        }
      });
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.get('/read_catalog/:c1', function(req, res){
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/g,'').toUpperCase();

    Catalog.findById(req.params.c1, function(err, catalog) {
      if (err)
      {
          res.send(err);
      }else
      {
        console.log(catalog);
        if(catalog){
          res.json(catalog);
        }else{
          res.json(''); //temporary should be removed later.
        }
      } 
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.put('/write_scene/:c1/:_id', function(req, res) {
  if(req.isAuthenticated()){
  //***TO DO: Add code to make sure authenticated user [req.user.username] has permissions to update the catalog. 
  req.params._id = req.params._id.replace(/-/g, '').toUpperCase();
  Scene.findById(req.params._id, function(err, scene) {
    if(!scene)
    {
      //did not find existing scene, updating.
      scene = new Scene();
      if(req.params._id){
        scene._id = req.params._id;
      }else{
        scene._id = uuid.v1().replace(/-/g, '').toUpperCase();
      }
    }else{
      console.log("scene already exists: updating");
    }

    scene.uidGroup=scene._id; //req.body.uidGroup.replace(/-/g,'');
    scene.fkuidGroup_t_catalog=req.body.fkuidGroup_t_catalog.replace(/-/g, '').toUpperCase();
    scene.title=req.body.title.replace(/-/g, '').toUpperCase();
    scene.name=req.body.name;
    scene.start_time=req.body.start_time;
    scene.end_time=req.body.end_time;
    scene.loop_until=req.body.loop_until;
    scene.loop_goto=req.body.loop_goto;
    scene.video_src=req.body.video_src;
    scene.apply_loop_fade=req.body.apply_loop_fade;
    scene.apply_scene_fade=req.body.apply_scene_fade;
    scene.end_scene=req.body.end_scene;
    scene.images=req.body.images;

    //go through each scene.images and build the scene precache property.
    scene.precache_scenes = [];
    for (var key in scene.images) {
        if (scene.images.hasOwnProperty(key)) {    
          if(scene.images[key] && scene.images[key].hasOwnProperty('fkuidGroup_t_catalog_to_scene'))
          {
            if(scene.images[key].fkuidGroup_t_catalog_to_scene != null && scene.images[key].fkuidGroup_t_catalog_to_scene != ''){
              scene.images[key].fkuidGroup_t_catalog_to_scene = scene.images[key].fkuidGroup_t_catalog_to_scene.replace(/-/g, '').toUpperCase()
              scene.precache_scenes.push(scene.images[key].fkuidGroup_t_catalog_to_scene);  
            }
          } else{
            scene.images[key].fkuidGroup_t_catalog_to_scene = null;
          }

          scene.images[key].scene_title = scene.images[key].scene_title.replace(/-/g, '').toUpperCase();
          scene.images[key].fkuidGroup_t_catalog_scene = scene.images[key].fkuidGroup_t_catalog_scene.replace(/-/g, '').toUpperCase();
          scene.images[key].uidGroup = scene.images[key].uidGroup.replace(/-/g, '').toUpperCase();
        }
    }
    
    scene.save(function(err) {
        if (err)
        {
            console.log("write_scene:failed");
            console.log(err);

            res.send("write_scene:failed");
        }else
        {
          console.log("write_scene:success");
          res.status(200).json({
            status: true
          });
        }
    });
  });
  }else{
    console.log('Unauthenticated user attempted to access write_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.get('/read_scene/:c1/:_id', function(req, res) { 
  if(req.isAuthenticated()){
    req.params._id = req.params._id.replace(/-/g, '').toUpperCase();
    console.log("trying to return scene:" + req.params._id);
    Scene.findById(req.params._id, function(err, scene) {
      if (err)
      {
          res.send(err);
      }else
      {
        console.log("returning a scene");
        console.log(scene.title);

        res.json(scene);
      }
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.get('/read_scenes/:c1/:search', function(req, res) { 
  if(req.isAuthenticated()){
    var s = '.*' 
    if(req.params.search != '~'){
      s = s + req.params.search + '.*';
    }
    Scene.find({ "name": { $regex: s, $options: 'i' } }, function(err, scenes) {
      if (err)
      {
          res.send(err);
      }else
      {
        var sc = {};
        var key;
        console.log('found scene(s):' + scenes.length);

        for(var i=0; i<scenes.length; i++){
          key = scenes[i]._id;
          sc[key] = scenes[i];
        }

        res.json(sc);
      }
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scenes');
    res.status(401).json({
      status: true
    });
  }
});

function split_title(title){
  //split the title into alpha part and number part.
  var res = {};
  title = title.split('').reverse().join(''); //reverse the title.

  var match = /[^0-9]/.exec(title);
  if (match) {
    res.title = title.substring(match.index+1);
    res.num = parseInt(title.substring(0, match.index).split('').reverse().join(''));
  }else{
    //no match
    res.title = title;
    res.num = parseInt(-1);
  }
  console.log('reverse:' + res.title);
  console.log(res.num);
  return res;
}

function sort_n(a,b) {
    return a - b;
}

function get_unique_title(catalog, _id, title){
  Scene.find({ "fkuidGroup_t_catalog": catalog }, function(err, scenes) {
      if (err)
      {
          res.send(err);
      }else
      {
      
      var test_match = split_title(title);
      var new_test;
      var numbers = [];
      //track best match so far.
      //track highest number so far.

      for(var i=0; i<scenes.length; i++){
        //if()
        //need to only add the name if it is similar enough to the title passed in.
          
          names.append(scenes[i].name);
          for (var key in scene[i].images) { //key is same as scene[i].images[key].title
            if (scene[i].images.hasOwnProperty(key)){
                if(scene[i].images[key]._id == _id){
                  //ignore result.
                }else{
                  new_test = split_title(key);
                  if(test_match.title.toUpperCase() == new_test.title.toUpperCase()){
                    //we have an exact match of the string.
                    numbers.append(test_match.num);
                  }
                }
            }
          }
      }

      //now sort the numbers array and get the biggest number.
      if(numbers.length > 0){
        numbers.sort(sort_n);
        console.log(numbers.join('',''));
        return title + (numbers[0]+1).toString();
      }else{
        //no match found
        return title;
      }
  }
});
}

openstory_router.get('/unique_titles/:c1/:_id/:title', function(req, res) { 
  //_id required to exclude the images[_id].title from the comparison.
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/,'').toUpperCase();   
        res.json(get_unique_title(req.params.c1, req.params._id.replace(/-/g, '').toUpperCase(), req.params.title));
  }else{
    console.log('Unauthenticated user attempted to access read_scenes');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.get('/delete_scene/:c1/:_id', function(req, res) { 
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/g, '').toUpperCase();
    req.params._id = req.params._id.replace(/-/g, '').toUpperCase();

    Scene.findOneAndRemove({_id : req.params.id, fkuidGroup_t_catalog: req.params.c1}, function(err) {
      if (err)
      {
          res.send(err);
      }
  });
  }else{
    console.log('Unauthenticated user attempted to access delete_scene');
    res.status(401).json({
      status: true
    });
  }
});


openstory_router.get('/read_first_scene/:c1', function(req, res) { 
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/g, '').toUpperCase();

    Catalog.findById(req.params.c1, function(err, catalog) {
      if (err)
      {
          res.send(err);
      }else
      {
        console.log(catalog);
        if(catalog){
          res.json(catalog.fkuidGroup_t_catalog_scene_first.replace(/-/g, '').toUpperCase());
        }else{
          res.json(''); //temporary should be removed later.
        }
      } 
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.put('/write_first_scene/:c1/:_id', function(req, res) { 
  if(req.isAuthenticated()){
    req.params.c1 = req.params.c1.replace(/-/g, '').toUpperCase();
    req.params._id = req.params._id.replace(/-/g, '').toUpperCase();
    console.log("trying to return first scene:" + req.params._id);
    Catalog.findById(req.params.c1, function(err, catalog) {
      if (err)
      {
          res.send(err);
      }else
      {
          catalog.fkuidGroup_t_catalog_scene_first = req.params._id;
          catalog.save(function(err) {
            if (err)
            {
                console.log("write_first_scene:failed");
                console.log(err);

                res.send("write_first_scene:failed");
            }else
            {
              res.status(200).json({
                status: true
              });
            }
          });
      } 
  });
  }else{
    console.log('Unauthenticated user attempted to access read_scene');
    res.status(401).json({
      status: true
    });
  }
});

openstory_router.put('/write_store', function(req, res) {
  if(req.isAuthenticated()){
    //req.user.username
    //req.body
    console.log("write_store");
    Openstory_store.find( { catalog: req.body.catalog, username: req.user.username, key: req.body.key}, function(err, openstory_store) {
      //should only return 1 value at most.
      if(openstory_store.length == 0)
      {
        //did not find existing scene, updating.
        openstory_store = []
        openstory_store[0] = new Openstory_store();      
      }

      openstory_store[0].catalog = req.body.catalog;
      openstory_store[0].username = req.user.username;      
      openstory_store[0].key = req.body.key;
      openstory_store[0].data = req.body.data;

      openstory_store[0].save(function(err) {
        if (err)
        {
            console.log("write_store:failed");
            console.log(err);

            res.send("write_store:failed");
        }else
        {
          res.status(200).json({
            status: true
          });
        }
      });

    });
  }else{
      console.log('Unauthenticated user attempted to access write_store');
      res.status(401).json({
        status: true
      });
  }
});

openstory_router.get('/read_store/:c1/:key', function(req, res) {
  if(req.isAuthenticated()){
    Openstory_store.find( { catalog: req.params.c1, username: req.user.username, key: req.params.key}, function(err, openstory_store) {
      if(openstory_store.length > 0)
      { 
        console.log(openstory_store[0]);       
        res.json(openstory_store[0].data);      
      }else{
        res.send("read_store:failed");
      }
    });
  }else{
    console.log('Unauthenticated user attempted to access read_store');
    res.status(401).json({
      status: true
    });
  }
});

module.exports = openstory_router;