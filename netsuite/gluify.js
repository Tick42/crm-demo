/*
  This module utilizes Tick42 Glue API and implements Tick42 CRM interface. 

  On receiving of glue invoke it raises the following events to NetSuite: 
    1) glue_selectContact (T42.SyncContact)
    2) glue_updateContact (T42.UpdateContactDetails)
  
  NetSuite can invoke Glue methods by raising events:
    1) selectContact (T42.SyncContact)
    2) resolveContact (T42.ResolveContactDetails)
  
  NB: 
    URIs of the Tick42 AWS are hardcoded
    The authentication is a bit wierd. It is using the Salesforce login so that the demos work better. Typically this will either move to NetSuite login or to Tick42 OAuth2 login.
*/

var lock = new Auth0Lock(
  'Sc2HAHMkhwMb79CRpj5Ukv3jaizjQYqU',
  'glue42.eu.auth0.com', {
    languageDictionary: {
      title: 'Glue42'
    },
    theme: {
      logo: 'https://zapier.cachefly.net/storage/developer/87f7a27ffde3df3993f9bf4d827eeee8.128x128.png'
    }
  }
);

lock.on("authenticated", function (authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  localStorage.setItem('accessToken', authResult.idToken);
});

setTimeout(function () {
  if (localStorage.getItem('accessToken')) {
    initializeGlue();
  } else {
    lock.show()
  }
}, 1000)

// End of authorization
function initializeGlue() {
  Tick42CRM({
    application: 'Netsuite Demo',
    authentication: localStorage.getItem('accessToken'),
    gateway: {
      ws: 'wss://dev2.tick42.com:50110',
      protocolVersion: 2
    },
    side: 'crm'
  }).then(function (T42) {
    // Debugging
    NetSuite.emitEvent('login', [T42.glue.agm.instance.info().UserName]);

    NetSuite.addListener('logout', function () {
      localStorage.removeItem('accessToken');
      window.location.reload();
    });

    NetSuite.addListener('selectContact', function (c) {
      var contactArgument = buildGlueContact(c);
      T42.CRM.SyncContact({contact: contactArgument})
    });

    NetSuite.addListener('resolveContact', function (c) {
      var contactArgument = buildGlueContact(c);
      T42.CRM.ResolveContact({contact: contactArgument});
    });

    T42.CRM.on('SyncContact', function(args) {
      NetSuite.emitEvent('glue_selectContact', [args.contact])
    });

    T42.CRM.on('UpdateContact', function(args) {
      var contact = args.contact;
      contact.ids.forEach(function (id) {
        if (id.systemName.toLowerCase() === 'netsuite') {
          NetSuite.emitEvent('glue_updateContact', [{
            id: id.nativeId,
            details: args.contact
          }])
        }
      });
    })
  }).catch(function (err) {
    localStorage.removeItem('accessToken');
    lock.show();
  })
}


var buildGlueContact = function (nativeContactObject) {
  return nativeContactObject
}
