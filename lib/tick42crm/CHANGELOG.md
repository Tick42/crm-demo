# 2.0.1 (28/04/2017)
## Features and Improvements
* Added option to specify timeout duration for method invocations
* Added possibility to return error objects, instead of only allowing error strings.

# 2.0.0 (27/04/2017)
## Features and Improvements
* CRM methods are now asynchronous. It is also possible to return a value or reject an invocation.
* Methods are not longer registered in bulk upon initialization. 
* Now using Glue Core v3.0.8 (saving ~120kb)

## Bug fixes
* Fixed wrong mapping of initialization options. It is now possible to override the default gateway.

## Breaking
* ```T42.CRM.once``` method removed
* npm package name changed from ```Tick42CRM``` to ```tick42-crm```

# 1.0.1
* Default gateway changed to dev2 instead of glue42
* Pass caller information to methods
