# Meteor Vermongo


Implementing Vermongo:
https://github.com/thiloplanz/v7files/wiki/Vermongo


## Usage

```javascript
    Requirements = new Meteor.Collection('requirements');
    new Vermongo(Requirements, {timestamps: true});
```

## Currently provides

* versioning of collection objects


## TODO

* Unit tests :)
* document removal
* log user on insert, update, remove
