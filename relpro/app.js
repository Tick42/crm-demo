angular.module('contactList', [])
  .filter('fuse', function () {
    return function (input, keys, search, options) {
      if (search && search !== '') {
        options = options || {};
        options.keys = keys;

        var fuse = new Fuse(input, options);
        var res = fuse.search(search);

        var out = res.filter(function (value, index, array) {
          return value.score <= 0.23;
        }).map(function (value, index, array) {
          return value.item;
        });

        return out;
      } else {
        return input;
      }
    };
  })
  .controller('ContactListController', function ($http, $interval, $scope) {
    var contactList = this;
    var sync = this;

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
      localStorage.setItem('accessToken', authResult.idToken);
    });

    setTimeout(function () {
      if (localStorage.getItem('accessToken')) {
        initializeGlue();
      } else {
        lock.show()
      }
    }, 1000)

    var initializeGlue = function () {
      Tick42CRM({
          application: 'T42MSDynamicCRMHelper',
          authentication: localStorage.getItem('accessToken'),
          gateway: {
            ws: 'wss://dev2.tick42.com:50110',
            protocolVersion: 2
          },
          side: 'helper'
        }).then(function (T42) {
          contactList.connected = true;
          contactList.searchProviders = {}
          contactList.query = null;
          contactList.externalContacts = [];

          contactList.searchExternalSources = function() {
            if (contactList.query) {
              contactList.externalContacts = [];
              contactList.query.search({
                name: 'displayName',
                value: contactList.searchFilter
              })
            }
          }

          T42.CRM.on('ResolveContact', (args, caller) => {
            $scope.$apply(function () {
              contactList.serverIds = args.contact.ids;
              contactList.searchFilter = `${args.contact.name.firstName} ${args.contact.name.lastName}`
            });
          })

          T42.CRM.on('SyncContact', (args, caller) => {
            if (args.contact.emails.length > 0 && args.contact.emails[0]) {
              contactList.contactEmail = args.contact.emails[0];
            } else {
              contactList.contactEmail = '(no email)'
            }
            $scope.$apply(function () {
              contactList.contactName = args.contact.fullName || '(no name)';
              contactList.selected = contactList.contactName + ' <' + contactList.contactEmail + '>'
            });
          })

          $http.get('../contacts')
            .then(function (res) {
              contactList.contacts = res.data.map(contact => {
                contact.ids = [{
                  nativeId: contact._id,
                  systemName: 'relpro'
                }]
                contact.name.otherNames = [contact.name.otherNames]
                return contact
              });
            })

          contactList.clearSearch = function () {
            contactList.searchFilter = "";
          }

          contactList.getClass = function (contact) {
            if (contact.email[0] === contactList.contactEmail) {
              return "bg-success"
            } else {
              return ""
            }
          };

          contactList.updateDetails = function (contact) {
            contact.ids = contactList.serverIds
            T42.CRM.UpdateContact({
              contact: contact
            });
          };

          contactList.syncContact = function (contact) {
            T42.CRM.SyncContact({
              contact: contact
            });
          };
        })
        .catch(function (err) {
          localStorage.removeItem('accessToken');
          lock.show();
        })
    }
  });