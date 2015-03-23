Vermongo = function (collection, op) {
  console.log('[Vermongo]', collection._name, op);
  var options = op || {};
  options.userId = options.userId || false;
  options.ignoredFields = options.ignoredFields || [];
  var self = this;

  // Setting hooks for a collection
  var add = function (collection) {
    var name = collection._name;

    // create a new collection if not already existing
    var _versions_collection = new Meteor.Collection(name + '.vermongo');

    /*  
     * insert hook
     * */
    collection.before.insert(function (userId, doc) {
      // add vermongo fields
      doc._version = 1;
      if (options['timestamps']) {
        var now = Date.now();
        if (!doc.createdAt) doc.createdAt = now;
        if (!doc.modifiedAt) doc.modifiedAt = now;

      }

      if (options.userId)
        doc[options.userId] = userId;

    });

    /*  
     * update hook
     * */
    collection.before.update(function (userId, doc, fieldNames, modifier, hook_options) {
      // do nothing if only ignored fields are modified
      if (options.ignoredFields.diff(fieldNames).equals([])) return;

      var now = Date.now();

      if (Meteor.isServer) { // avoid duplicated insertion
        // in case of doc not already versionned
        if (!doc._version) doc._version = 1;

        // copy doc to versions collection
        var savedDoc = _.extend({}, doc); // shallow copy
        if (typeof(savedDoc._id) !== 'undefined') delete savedDoc._id;
        savedDoc.ref = doc._id;

        _versions_collection.insert(savedDoc);
      }

      // incrementing version
      modifier.$set._version = doc._version + 1;

      // updating 'modifiedAt'
      modifier.$set = modifier.$set || {};
      if (options['timestamps']) {
        modifier.$set.modifiedAt = now;
        modifier.$set[options.userId] = userId;
      }
      if (options.userId)
        modifier.$set[options.userId] = userId;

    });


    collection.helpers({
      versions: function () {
        return _versions_collection.find({ref: this._id});
      },

    });

    return self;
  };

  if (typeof(collection) !== 'undefined' && collection !== null)
    add(collection);

  return self;
};
