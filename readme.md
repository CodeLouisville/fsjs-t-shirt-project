# FSJS Week 0 - Welcome to the FSJS Code Louisville Class

**Outline**

* Install NodeJS
* Install Git (windows only/mac os x comes with it)
* Create a mLab account

# Install/Setup git 
## macOS X (_not required_)
1. Download https://git-scm.com/download/mac
2. Install the .dmg

## windows
1. Download https://git-scm.com/download/win
2. Run the setup wizard .exe
_I recommend picking add commands to windows command line so that cmd and git bash have the same functions_

# Install/Setup nodejs/npm
## nodejs/npm Install
### macOS X
1. Download https://nodejs.org/dist/v8.11.1/node-v8.11.1.pkg
2. Run the setup wizard .pkg file

### windows
1. Download https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi or https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi
2. Run the setup wizard .exe file

# Install/Setup mLab
## mLab
### both
1. Head over to [mLab](https://mlab.com/signup/) and signup/login
2. Create a new MongoDB deployment
3. Pick Amazon Web Services and Free(Sandbox)
4. Give your db a name, example `fsjs-db1`
5. Click the new deployment (give it a second)
6. Create a new collection or do it via code
7. At the top you will see the connection settings, example:
```
To connect using a driver via the standard MongoDB URI (what's this?):

mongodb://<dbuser>:<dbpassword>@ds1111111.mlab.com:17360/fsjs-db1
```

This will go into your node project!

_See it was as Easy as ABC123_