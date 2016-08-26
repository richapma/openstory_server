var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Catalog = new Schema({
  _id: String,
  uidGroup: String,
  fkuidGroup: String,
  title: String,
  width: Number,
  height: Number,
  fontSize: Number,
  fkuidGroup_t_catalog_scene_first: String,
  DownloadLink: [{value:String}], 
  Description: String, 
  YouTubeEmbedUrl: String, 
  ImageUrl1: String, 
  ImageUrl2: String, 
  ImageUrl3: String, 
  ImageUrl4: String, 
  ImageUrl5: String, 
  Hide: Number, 
  Released: Number, 
  ModReview: Number, 
  AgeFrom: Number, 
  AgeTo: Number, 
  FlagInappropriate: Number,  
  fkuidGroup_t_catalog_update: String, 
  fkuidGroup_t_catalog_genre: String,
  WritePermissions: [{value:String}], 
  RecordCurrent: Number, 
  DateRecordCurrent: Date
});

module.exports = mongoose.model('catalog', Catalog);
