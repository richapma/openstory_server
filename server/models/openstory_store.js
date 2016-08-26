var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Openstory_store = new Schema({
  catalog: String,
  username: String,
  key: String,
  data: Schema.Types.Mixed
});

module.exports = mongoose.model('openstory_store', Openstory_store);
