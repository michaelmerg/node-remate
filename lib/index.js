
var fs = require ('fs');
var path = require ('path');
var ejs = require ('ejs');
var juice = require ('juice');
var async = require ('async');


var defaults = {
  templates: path.join(__dirname, '../../../email_templates')
};

function Remate (template, locals, options, cb) {

  if (typeof options === 'function') {
    cb = options;
    options = defaults;
  } else {

    // Merge options
    if (!options)
      options = defaults;
    else {

      // templeate directory
      if (!options.templates) options.templates = defaults.templates;

    }
  }

  var templatePath = path.join(options.templates, template);

  fs.lstat(templatePath, function (err, stats) {
    if (err || !stats.isDirectory())
      return cb(new Error('template "' + template + '" not found'));

    // Create paths
    var textPath = path.join(templatePath, 'text.ejs');
    var htmlPath = path.join(templatePath, 'html.ejs');

    async.map([ textPath, htmlPath ], fs.readFile, function (err, results) {
      if (err) return cb(err);

      // set ejs options
      locals.open = options.open || '<%';
      locals.close = options.close || '%>';

      // render text
      locals.filename = textPath;
      var text = ejs.render(results[0].toString(), locals);

      // render html
      locals.filename = textPath;
      var html = ejs.render(results[1].toString(), locals);

      // juiceify html
      juice.juiceContent(html, {
        url: 'WILL BE IGNORED', // juice.js [0.2.0] - line:263 -> results.push()
        applyLinkTags: false
      }, function(err, juicedHtml) {
        if (err) return cb(err);

        cb(null, juicedHtml, text);
      });

    }); // fs.readFile
  }); // fs.stat
}

module.exports = exports = Remate;