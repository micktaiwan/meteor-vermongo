# Meteor Vermongo

Implementing Vermongo:
https://github.com/thiloplanz/v7files/wiki/Vermongo

Github:
https://github.com/micktaiwan/meteor-vermongo/

AtmosphereJS:
https://atmospherejs.com/mickaelfm/vermongo

Report bugs or suggestions:
https://github.com/micktaiwan/meteor-vermongo/issues

## Currently provides

* automatic versioning of collection documents
* helper to access old versions of documents
* option for automatic timestamping
* option for automatic logging userId
* option for ignoring some updated fields


## Usage


```javascript
    Requirements = new Meteor.Collection('requirements').vermongo({timestamps: true, userId: 'modifierId', ignoredFields: ['rank']});

    Template.requirements.onCreated(function() {

      var id = Requirements.insert({title: "new insert with default value"});
      Requirements.update({_id: id}, {$set:{title: "updated with new value !"}});

    });

    Template.requirements.helpers({

      requirements: function() {
        return Requirements.find();
      },

    });
```


```html
    <body>
      <h1>Welcome to Meteor!</h1>

      <button class="js-new">New</button>
      {{> requirements}}

    </body>

    <template name="requirements">
      <ul>
        {{#each requirements}}
        {{> req }}
        {{/each}}
      </ul>
    </template>

    <template name="req">
      <li>{{title}} - {{modifiedAt}} - version: {{_version}}</li>
      <ul>
        {{#each versions}}
        {{> version }}
        {{/each}}
      </ul>
    </template>

    <template name="version">
      <li>{{title}} - {{modifiedAt}} - version: {{_version}}</li>
    </template>
```

A new collection *"mycollection.vermongo"* will be created for each versioned collection and will store old document versions.

A collection helper *"versions"* is created to access old versions of the document.


## TODO

* Unit tests :)
* document removal
* logging user on remove
* undo helper
