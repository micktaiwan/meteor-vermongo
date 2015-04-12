Package.describe({
  name: 'mickaelfm:vermongo',
  version: '0.0.8',
  summary: 'Add versions to your documents. Implementing vermongo. Automatic versioning of collection documents, including removal. Helper to access old versions of documents. Automatic timestamping.',
  git: 'https://github.com/micktaiwan/meteor-vermongo.git',
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
