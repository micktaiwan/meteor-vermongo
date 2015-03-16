Vermongo = function (options) {
  this.options = options || {};
  if(this.options['console']) console.log('[Vermongo] constructor');
  this.collections = [];
  return this;
};

// Setting hooks for a collection
Vermongo.prototype.add = function (collection) {
  var name = collection._name;
  var self = this;
  if(this.options['console']) console.log('[Vermongo] adding hooks for collection', name);

  // create a new collection if not already existing
  var versions = new Meteor.Collection(name+'_version');

  // add the couple to the internal tracking variable
  this.collections.push({c: collection, v: versions});

  /*  
   * insert hook
   * */
  collection.before.insert(function(userId, doc) {
    if(self.options['console']) console.log('[Vermongo] insert hook on', versions._name);
    // add vermongo fields
    doc._version = 1;
    var now = Date.now();
    if(!doc.createdAt) doc.createdAt = now;
    if(!doc.modifiedAt) doc.modifiedAt = now;
  });

  /*  
   * update hook
   * */
  collection.before.update(function(userId, doc, fieldNames, modifier, options) {
    if(self.options['console']) console.log('[Vermongo] update hook on', versions._name, fieldNames);
    var now = Date.now();
    // in case of doc not already versionned
    if(!doc._version) doc._version = 1;

    // copy doc to versions collection
    var savedDoc = _.extend({}, doc); // shallow copy
    savedDoc.ref = doc._id;
    if(typeof(savedDoc._id) != 'undefined') delete savedDoc._id;
    console.log(versions.insert(savedDoc)); // FIXME: why inserted 2 times ???

    // adding 'modifiedAt'
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = now;
    // incrementing version
    modifier.$set._version = doc._version + 1;
  });

  if(this.options['console']) console.log('[Vermongo] collections count:', this.collections.length);
  return this;
};
