Package.describe({
  name: 'mickaelfm:vermongo',
  version: '1.1.4',
  summary: 'Add versions to your documents. Implementing vermongo. Automatic versioning of collection documents',
  git: 'https://github.com/micktaiwan/meteor-vermongo.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('WINDOWS-PREVIEW@0.3.0');
  api.versionsFrom('METEOR@1.0.3.2');
  api.addFiles('vermongo.js');
  api.use('matb33:collection-hooks@0.7.11');
  api.use('dburles:collection-helpers@1.0.2');

  api.export('Vermongo'); // necessary ?
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.addFiles('vermongo.js');
  api.use('matb33:collection-hooks@0.7.11');
  api.use('dburles:collection-helpers@1.0.2');

  api.addFiles('vermongo-tests.js');
});
