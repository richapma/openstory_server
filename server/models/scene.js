var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Scene = new Schema({
  _id: String,
  uidGroup: String,
  fkuidGroup_t_catalog: String,
  title: String,
  name: String,
  start_time: Number,
  end_time: Number,
  loop_until: Number,
  loop_goto: Number,
  video_src: String,
  apply_loop_fade: Number,
  apply_scene_fade: Number,
  end_scene: Number,
  images: Schema.Types.Mixed,
  precache_scenes: [String]
});

module.exports = mongoose.model('scene', Scene);
