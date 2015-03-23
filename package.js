Package.describe({
  name: 'mickaelfm:vermongo',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Add versions to your documents. Implementing vermongo.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/micktaiwan/meteor-vermongo.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('WINDOWS-PREVIEW@0.3.0');
  api.versionsFrom('METEOR@1.0.3.2');
  api.addFiles('vermongo.js');
  api.use('matb33:collection-hooks@0.7.11');
  api.use('dburles:collection-helpers@1.0.2');

  api.export('Vermongo');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mickaelfm:vermongo@0.0.3');
  api.use('matb33:collection-hooks@0.7.11');
  api.use('dburles:collection-helpers@1.0.2');

  api.addFiles('vermongo-tests.js');
});
