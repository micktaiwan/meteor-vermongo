Vermongo = function (collection, options) {
  var options = options || {};
  var self = this;

  // Setting hooks for a collection
  var add = function (collection) {
    var name = collection._name;
    var self = this;

    // create a new collection if not already existing
    var _versions_collection = new Meteor.Collection(name+'.vermongo');

    /*  
      * insert hook
      * */
    collection.before.insert(function(userId, doc) {
      // add vermongo fields
      doc._version = 1;
      if(options['timestamps']) {
        var now = Date.now();
        if(!doc.createdAt) doc.createdAt = now;
        if(!doc.modifiedAt) doc.modifiedAt = now;
      }
    });

    /*  
      * update hook
      * */
    collection.before.update(function(userId, doc, fieldNames, modifier, hook_options) {
      var now = Date.now();

      if (Meteor.isServer) {
        // in case of doc not already versionned
        if(!doc._version) doc._version = 1;

        // copy doc to versions collection
        var savedDoc = _.extend({}, doc); // shallow copy

        //savedDoc._id = {_id: doc._id, version: doc._version}
        // can not do this as Meteor requires document _id fields to be non-empty strings or ObjectIDs

        if(typeof(savedDoc._id) !== 'undefined') delete savedDoc._id;
        savedDoc.ref = doc._id;

        _versions_collection.insert(savedDoc);
      }

      // adding 'modifiedAt'
      modifier.$set = modifier.$set || {};
      if(options['timestamps']) { modifier.$set.modifiedAt = now; }
      // incrementing version
      modifier.$set._version = doc._version + 1;
    });


    collection.helpers({
      versions: function() {
        return _versions_collection.find({ref: this._id});
      },

    });

    return self;
  };

  if(typeof(collection) !== 'undefined' && collection !== null)
    add(collection);

  return self;
};
