# vChat

## Description

A minimalistic group video chat app built with Django using Agora SDK.

## Setup

### Clone the repository

```
git clone https://github.com/Constantine7s/vChat.git
```
### Install the required packages
Use the package manager [pip](https://pip.pypa.io/en/stable/) to install required packages.

```bash
pip install -r requirements.txt
```

### Update the Agora credentials
To use this app you need to create an account on [Agora.io](https://www.agora.io/en/) and create a new app. Then you need to copy the `appCertificate` and `appId` to `views.py` and `stream.js`

###### views.py
```
def getToken(request):
    appId = "YOUR APP ID"
    appCertificate = "YOUR APPS CERTIFICATE"
    ......
```

###### stream.js
```
....
const APP_ID = 'YOUR APP ID'
....
```

### Run the server
```
python manage.py runserver
```
