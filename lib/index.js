
var fs = require ('fs');
var path  = require ('path'),
    jade  = require ('jade'),
    juice = require ('juice'),
    async = require ('async');


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
    var textPath = path.join(templatePath, 'text.jade');
    var htmlPath = path.join(templatePath, 'html.jade');

    // Make jade output pretty
    locals.pretty = true;

    async.map([ textPath, htmlPath ], fs.readFile, function (err, results) {
      if (err) return cb(err);

      // render text
      locals.filename = textPath;
      var text = jade.render(results[0].toString(), locals);

      // render html
      locals.filename = htmlPath;
      var html = jade.render(results[1].toString(), locals);

      // juiceify html
      juice.juiceContent(html, {
        url: 'REQUIRED, BUT WILL BE IGNORED',
        applyLinkTags: false
      }, function(err, juicedHtml) {
        if (err) return cb(err);

        cb(null, juicedHtml.trim(), text.trim());
      });

    }); // fs.readFile
  }); // fs.stat
}

module.exports = exports = Remate;
