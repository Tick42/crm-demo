var NetSuite = new EventEmitter();

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
  .controller('ContactListController', function ($scope, $http, $interval, $timeout) {
    $scope.lastId = 0;
    $scope.contactEmail = null;

     $http.get('../contacts')
      .then(function (res) {
        $scope.contacts = res.data.map(contact => {
          contact.ids = [{
            nativeId: contact._id,
            systemName: 'netsuite'
          }]
          contact.name.otherNames = [contact.name.otherNames]
          return contact
        });

        $scope.lastId = 0;
      })

    $scope.clearSearch = function() {
      $scope.searchFilter = "";
    }
    $scope.updateContact = function (args) {
      const contactToUpdate = $scope.contacts.findIndex(function(el, index, arr) {
        return el._id == args.id;
      });
      if (contactToUpdate >= 0) {
        $scope.$apply(function() {
          Object.assign($scope.contacts[contactToUpdate], $scope.contacts[contactToUpdate], args.details)
        });
      } else {
        alert("Unknown contact");
      }
    }

    $scope.addContact = function () {
      const fullName = $scope.newContact.fullName.split(' ');
      let name = {};

      if (fullName.length === 2) {
        name = {
          honorific: '',
          firstName: fullName[0],
          lastName: fullName[1]
        }
      } else {
        name = {
          honorific: fullName[0],
          firstName: fullName[1],
          lastName: fullName[2]
        }
      }

      $scope.contacts.push({
        id: ++$scope.lastId,
        name: name,
        email: [$scope.newContact.email]
      })

      $scope.newContact = {};
    };

    $scope.logout = function() {
      NetSuite.emitEvent('logout');
    };

    $scope.resolveDetails = function (contact) {
      NetSuite.emitEvent('resolveContact', [contact])
    };

    $scope.selectContact = function (contact, emit) {
      var selectedEmail;
      if (typeof contact === 'string') {
        selectedEmail = contact;
      } else {
        selectedEmail = contact.emails ? contact.emails[0] : '';
      }
      const selectedContact = $scope.contacts.find(function(el, index, arr) {
          return el.emails[0] === selectedEmail;
        });

      $timeout(function() {
        if (emit) {
          NetSuite.emitEvent('selectContact', [selectedContact])
        }
        $scope.contactEmail = selectedEmail;
      }, 0);
    };


    NetSuite.addListener('login', function(user) {
      $scope.$apply(function() {
        $scope.user = user;
      })
    });

    NetSuite.addListener('glue_selectContact', function(contact) {
      $scope.selectContact(contact.emails[0]);
    });

    NetSuite.addListener('glue_updateContact', function(contact) {
      $scope.updateContact(contact);
    });

   
  });


