# Meteor Vermongo


Implementing Vermongo:
https://github.com/thiloplanz/v7files/wiki/Vermongo


## Usage

```javascript
    Requirements = new Meteor.Collection('requirements');
    new Vermongo(Requirements, {timestamps: true});
    var id = Requirements.insert({title: "new insert with default value"});
    Requirements.update({_id: id}, {$set:{title: "updated with new value !"}});
```

A new collection "mycollection.vermongo" will be created for each versionned collection and will store old document versions.


## Currently provides

* versioning of collection objects


## TODO

* Unit tests :)
* document removal
* log user on insert, update, remove
