
var path  = require ('path'),
    jade  = require ('jade'),
    juice = require ('juice');

var helper = require('./helper');

var defaults = {
  templates: path.join(__dirname, '../../../email-templates')
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

  var templatePath = path.join(options.templates, template + '.jade');

  console.log(templatePath);

  // Make jade output pretty
  locals.pretty = true;

  // Provide filename to handle includes
  locals.filename = templatePath;

  var html = jade.renderFile(templatePath, locals);
  var text = helper.stripHTML(html);

  // juiceify html
  juice.juiceContent(html, {
    url: 'REQUIRED, BUT WILL BE IGNORED',
    applyLinkTags: false
  }, function(err, juicedHtml) {
    if (err) return cb(err);

    cb(null, juicedHtml.trim(), text.trim());
  });
}

module.exports = exports = Remate;
