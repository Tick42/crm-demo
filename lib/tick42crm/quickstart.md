NB: Examples assume ES6 knowledge and browser usage.
# Description 
The library is a wrapper around Tick42's Glue for web. It implements Tick42 CRM specification.

# Initialization
The first thing to do after loading the library is to initialize it.  

- application name (optional)
- authentication - Credentials object or access token string for the identity provider
- gateway (optional)
- side - Are you a helper or CRM?

``` javascript
  Tick42CRM({
    application: 'SampleApp',
    authentication: {
      username: 'john.doe@tick42.com',
      password: 'letmein'
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
  side: 'helper'
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
  side: 'crm'
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

## Listening for method calls
The library inherits from nodejs' [EventEmitter](https://nodejs.org/api/events.html). Usage is similar. 

```
T42.CRM.on(METHOD_NAME, function(args) {
  // console.log(args);
})
```
where "METHOD_NAME" is one of the CRM methods defined in the specification.

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