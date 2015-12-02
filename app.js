var program = require('commander');
var file = require('file');
var exif = require('exiftool');
var fs   = require('fs-extra');
var path = require('path');
var moment = require('moment');

program
  .version('0.0.1')
  .option('-p, --path [path]', 'Source directory of images')
  .parse(process.argv);

var outdir = './photos/';

var moveFile = function(infile, indate){
	var filename = infile;
	var filedatestg = indate;
	if(filedatestg){
		var filedate = moment(filedatestg, "YYYY:MM:DD HH:mm:ss.SS");
		var dir = outdir + filedate.format("YYYY/MM/DD/");
		fs.mkdirs(dir, function (err) {
			file.walk(dir, function (input_null, origin, dirs, files) {
				var newname = 1;
				if(files.length >= 1){
					newname = files.length + 1;
				}
				var ext = path.extname(filename).toLowerCase();
				fs.copy(filename, dir+newname+ext, function (err) {
					  if (err) return console.error(err)
					  console.log(filename +' >> '+ dir+newname+ext);
				});				
			});
		});
	}
	else {
		fs.mkdirs(outdir + 'noexif', function (err) {
			file.walk(outdir + 'noexif', function (input_null, origin, dirs, files) {
				var newname = 1;
				if(files.length >= 1){
					newname = files.length + 1;
				}
				var ext = path.extname(filename).toLowerCase();
				fs.copy(filename, outdir + 'noexif/'+newname+ext, function (err) {
					  if (err) return console.error(err)
					  console.log(filename +' >> '+ outdir + 'noexif/'+newname+ext);
				});				
			});
		});
	}
}

var parsePhoto = function(file){
	var name = file;

	fs.readFile(name, [], function (err, data) {
	  if (err)
	    throw err;
	  else {
	    exif.metadata(data, function (err, metadata) {
	      if (err)
	        throw err;
	      else
	      	moveFile(name, metadata.createDate);
	    });
	  }
	});
};

if (program.path){
	file.walk(program.path, function (input_null, origin, dirs, files) {
		for (var i = files.length - 1; i >= 0; i--) {
			parsePhoto(files[i]);
		};
	});
}
else {
	console.log('You must specify a directory')
}
