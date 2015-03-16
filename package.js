Package.describe({
  name: 'mickaelfm:vermongo',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Implementing vermongo',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/micktaiwan/meteor-vermongo.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('WINDOWS-PREVIEW@0.3.0');
  api.addFiles('mickaelfm_vermongo.js');
  api.use('matb33:collection-hooks');
  api.export('Vermongo');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mickaelfm:vermongo');

  api.addFiles('mickaelfm_vermongo-tests.js');
});
