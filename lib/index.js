
var assert  = require ('assert'),
    path    = require ('path'),
    jade    = require ('jade'),
    juice   = require ('juice');

var helper = require('./helper');


function Remate (template, options, cb) {
  assert.ok(template);

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  // Make jade output pretty
  options.pretty = true;

  // set root path and add create fullpath
  options.root = options.root || path.join(__dirname, '../../../email-templates');
  template = path.join(options.root, template + '.jade');

  // Provide filename to handle includes
  options.filename = options.filename || template;

  var html = jade.renderFile(template, options);
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
