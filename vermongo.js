// [1,2,3,4,5,6].diff( [3,4,5] );  => [1, 2, 6]
Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

// [1, 2, [3, 4]].sameAs([1, 2, [3, 2]]) === false;
// attach the .sameAs method to Array's prototype to call it on any array
Array.prototype.sameAs = function(array) {
  // if the other array is a falsy value, return
  if(!array)
    return false;

  // compare lengths - can save a lot of time
  if(this.length != array.length)
    return false;

  for(var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if(this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if(!this[i].sameAs(array[i]))
        return false;
    }
    else if(this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

Meteor.Collection.prototype.vermongo = function(op) {
  var collection = this;
  //console.log('[Vermongo]', collection._name, op);
  var options = op || {};
  options.userId = options.userId || false;
  options.ignoredFields = options.ignoredFields || [];
  var offOnce = false;
  var _versions_collection = null;

  // Setting hooks for a collection
  var add = function(collection) {
    var name = collection._name;

    // create a new collection if not already existing
    _versions_collection = new Meteor.Collection(name + '.vermongo');

    /*
     * insert hook
     * Beware that collection2 validation occurs *before* this callback
     * */
    collection.before.insert(function(userId, doc) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // add vermongo fields
      doc._version = 1;
      if(options['timestamps']) {
        var now = new Date();
        if(!doc.createdAt) doc.createdAt = now;
        if(!doc.modifiedAt) doc.modifiedAt = now;
      }

      if(!doc[options.userId] && options.userId && userId)
        doc[options.userId] = userId;

    });

    // copy Doc in vermondo collection
    var copyDoc = function(doc) {
      if(Meteor.isServer) { // avoid duplicated insertion
        // copy doc to versions collection
        var savedDoc = _.extend({}, doc); // shallow copy
        if(typeof(savedDoc._id) !== 'undefined') delete savedDoc._id;
        savedDoc.ref = doc._id;

        _versions_collection.insert(savedDoc);
      }
    };

    /*
     * update hook
     * */
    collection.before.update(function(userId, doc, fieldNames, modifier, hook_options) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // do nothing if only ignored fields are modified
      if(fieldNames.diff(options.ignoredFields).sameAs([])) return;

      // in case of doc not already versionned
      if(!doc._version) doc._version = 1;

      copyDoc(doc);

      // incrementing version
      modifier.$set = modifier.$set || {};
      modifier.$set._version = doc._version + 1;

      if(options['timestamps'])
        modifier.$set.modifiedAt = new Date();
      if(!doc[options.userId] && options.userId && userId)
        modifier.$set[options.userId] = userId;

    });

    /*
     * remove hook
     * */
    collection.before.remove(function(userId, doc) {
      // do nothing if special option is set
      if(offOnce) {
        offOnce = false;
        return;
      }
      // in case of doc not already versionned
      if(!doc._version) doc._version = 1;

      copyDoc(doc); // put last known version in vermongo collection

      // put a dummy version with deleted flag
      doc._version = doc._version + 1;
      if(options['timestamps'])
        doc.modifiedAt = new Date();
      if(!doc[options.userId] && options.userId && userId)
        doc[options.userId] = userId;
      doc._deleted = true;
      copyDoc(doc);
    });

    /*
     * collection helpers
     * */
    collection.helpers({
      versions: function() {
        return _versions_collection.find({ref: this._id}, {sort: {_version: -1}});
      }
    });

    collection.vermongoOffOnce = function() {
      offOnce = true;
    };

    return collection;
  };

  this.getVersionCollection = function() {
    return _versions_collection;
  };

  if(typeof(collection) !== 'undefined' && collection !== null)
    add(collection);

  return collection;
};
