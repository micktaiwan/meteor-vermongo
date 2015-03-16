Vermongo = function (options) {
  console.log('[Vermongo] constructor');
  this.collections = [];
  return this;
};

Vermongo.prototype.add = function (collection) {
  console.log('[Vermongo] adding', collection._name);
  this.collections.push(collection);
  collection.before.insert(function(userId, doc) {
    doc.createdAt = Date.now();
    doc._version = 1;
  });
  console.log('[Vermongo] collections count:', this.collections.length);
  return this;
};
