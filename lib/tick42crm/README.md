NB: Examples assume ES6 knowledge and browser usage.
# Description 
The library is a wrapper around Tick42's Glue for web. It implements Tick42 CRM specification.

# Initialization
The first thing to do after loading the library is to initialize it.  

- application: The name of the application (optional)
- authentication: Credentials object or access token string for the identity provider. Demo User and Pass: "demo_tick42@mailinator.com" / "a123456789A" - without quotes.
- gateway: Websocket url for the gateway. Uses the gw on dev2.tick42.com by default. (optional);
- side - Are you a helper or a CRM. Default is CRM.

``` javascript
  Tick42CRM({
    application: 'SampleApp',
    authentication: {
      username: 'demo_tick42@mailinator.com',
      password: 'a123456789A'
    },
    side: 'crm' // or 'helper'
  }).then(T42 => {
    // Use the library here.
    console.log(T42); 
  }).catch(err => {
    // Failed to initialize. Handle errors here.
    console.log(err);
  })
```

# Usage 
If you intend to use the library across multiple modules, it's a good idea to initialize it once and store the promise in a global variable. eg.

``` 
// app.js
window.T42Promsie = Tick42CRM({
  ...
});
```
```
// client.js
T42Promise.then(T42 => {
  T42.CRM.CreateContact({
    contact: {
      ids: [{
        nativeId: 1,
        systemName: 'Sample'
      }]
    }
  });
})
```

Another posibility is to writer your code in a way that it depends on the T42 promise:

```
Tick42CRM({
  ...
}).then(T42 => {
  // All your code here.
})
```


## Working example:

```
// For RelPro
Tick42CRM({
  application: 'RelPro 42',
  authentication: {
    username: 'demo_tick42@mailinator.com',
    password: 'a123456789A'
  },
  side: 'helper',
  timeout: 5000 // Time in milliseconds. Default is 3000. Optional.
}).then(T42 => {
  T42.CRM.on('ResolveContact', (args) {
    console.log('Hey! ' + args.ids);
  });
});


// For NetSuite
Tick42CRM({
  application: 'NetSuite 42',
  authentication: {
    username: 'demo_tick42@mailinator.com',
    password: 'a123456789A'
  },
  side: 'crm',
  timeout: 5000 // Time in milliseconds. Default is 3000. Optional.
}).then(T42 => {
  T42.CRM.ResolveContact({
    contact: {
      ids: [{
        systemName: 'Netsuite',
        nativeId: '5'
      }]
    }
  })
});
```


## Calling a method
The pattern for calling a method is:

```
T42.CRM.METHOD_NAME(arguments);
```
where "METHOD_NAME" is one of the CRM methods defined in the specification. All available methods are listed below.

## Listening for method calls and returning and consuming data from methods

```
T42.CRM.on('T42.CRM.CreateContact', function(contact, caller, success, error) {
  var NetSuiteContact = new Contact(contact);

  // Do some backend stuff. Return the contact object if it was successfully created, otherwise return an error.
  if (NetSuiteContact) {
    success(NetSuiteContact)
  } else {
    error("Can't create a contact. Already exists")
  }
})

T42.CRM.CreateContact(...)
  .then(result => {
    console.log(result.returned) // The contact returned from the success handler above
  }).catch(error => {
    console.log(error.message) // The message returned from the erro handler above
  })
```
NOTES:
* If you don't return a value (call success) or reject (call error) an invocation within 3 seconds of receiving it will call the error callback on the caller.
* The succcess and error handlers accept an **Object**. The object passed to the error callback MUST contain "message" property.


### T42.CRM.CreateContact({contact: {}})
```
T42.CRM.CreateContact({
  contact: {
    ids: [{
      nativeId: '1984',
      systemName: 'Airstrip One'
    }],
    displayName: 'John Doe',
    name: {
      firstName: 'John',
      lastName: 'Doe'
    },
    status: 'lead',
    isPerson: true,
    account: {
      nativeId: '1',
      systemName: 'Airstrip One'
    }
  }
});
```

Signature: 
```
Composite {
  Composite { 
    String? city, 
    String? country, 
    String? description, 
    String? postalCode, 
    String? stateOrRegion, 
    String? streetAddress 
  }[]? addresses, 
  String? displayName, 
  String[]? emails, 
  Bool? isPerson, 
  Composite { 
    String? companyName, 
    String? firstName, 
    String? honorific, 
    String? lastName,
    String[]? otherNames, 
    String[]? postNominalLetters 
  }? name, 
  Composite { 
    String name, 
    String number 
  }[]? phones, 
  String? status 
} contact
```

### T42.CRM.ResolveContact({contact: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.UpdateContact({contact: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.DeleteContact({contact: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.SyncContact({contact: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.LogContactCall({contact: {}})
The signature is the same as T42.CRM.CreateContact

### T42.CRM.CreateAccount({contact: {}})
```
T42.CRM.CreateContact({
  account: {
    ids: [{
      nativeId: '1984',
      systemName: 'Airstrip One'
    }],
    displayName: 'John Doe',
    name: 'Ministry of truth',
    status: 'lead'
  }
});
```

Signature: 
```
Composite { 
  Composite { 
    String? city, 
    String? country, 
    String? description, 
    String? postalCode, 
    String? stateOrRegion, 
    String? streetAddress 
  }[]? addresses, 
  String? billingEmailAddress, 
  Composite { 
    String nativeId, 
    String systemName 
  }[]? contacts, 
  String? displayName, 
  String[]? emailDomains, 
  Composite { 
    String nativeId, 
    String systemName 
  }[] ids, 
  String? name, 
  Composite { 
    String nativeId, 
    String systemName 
  }? owner, 
  Composite { 
    String name, 
    String number 
  }[]? phones, 
  String? status, 
  Composite { 
    String nativeId, 
    String systemName 
  }[]? subsidiaries, 
  String[]? website 
} account
```

### T42.CRM.ResolveAccount({account: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.UpdateAccount({account: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.DeleteAccount({account: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.SyncAccount({account: {}})
The signature is the same as T42.CRM.CreateContact
### T42.CRM.ResolveAccountContactList({account: {}, contacts: []})
```
T42.CRM.CreateContact({
  account: {
    ids: [{
      nativeId: '1984',
      systemName: 'Airstrip One'
    }],
    displayName: 'John Doe',
    name: 'Ministry of truth',
    status: 'lead'
  },
  contacts: [{
    ids: [{
      nativeId: '1984',
      systemName: 'Airstrip One'
    }],
    displayName: 'John Doe',
    name: {
      firstName: 'John',
      lastName: 'Doe'
    },
    status: 'lead',
    isPerson: true,
    account: {
      nativeId: '1',
      systemName: 'Airstrip One'
    }
  }]
});
```

Signature: 

```
Composite { 
  Composite { 
    String? city, 
    String? country, 
    String? description, 
    String? postalCode, 
    String? stateOrRegion, 
    String? streetAddress 
  }[]? addresses, 
  String? billingEmailAddress, 
  Composite { 
    String nativeId, 
    String systemName 
  }[]? contacts, 
  String? displayName, 
  String[]? emailDomains, 
  Composite { 
    String nativeId, 
    String systemName 
  }[] ids, 
  String? name, 
  Composite { 
    String nativeId, 
    String systemName 
  }? owner, 
  Composite { 
    String name, 
    String number 
  }[]? phones, 
  String? status, 
  Composite { 
    String nativeId, 
    String systemName 
  }[]? subsidiaries, 
  String[]? website 
} account,

Composite { 
  Composite { 
    String? city, 
    String? country, 
    String? description, 
    String? postalCode, 
    String? stateOrRegion, 
    String? streetAddress 
  }[]? addresses, 
  String? displayName, 
  String[]? emails, 
  Bool? isPerson, 
  Composite { 
    String? companyName, 
    String? firstName, 
    String? honorific, 
    String? lastName, 
    String[]? otherNames, 
    String[]? postNominalLetters 
  }? name, 
  Composite { 
    String name, 
    String number 
  }[]? phones, 
  String? status
}[] contacts