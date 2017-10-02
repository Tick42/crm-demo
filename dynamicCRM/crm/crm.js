// sample Auth0 application config
var auth0 = new auth0.WebAuth({
    domain: "glue42.eu.auth0.com",
    clientID: "2umK3QyDq2Mb5x6MAet7OgDcf3IXVVxm"
});

document.addEventListener("DOMContentLoaded", handleDOMLoaded);

// check if there is access token in local storage
if (localStorage.getItem('accessToken')) {
    initializeGlueCore(localStorage.getItem('accessToken'));
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("logoffBtn").style.display = "inline";
}

function doAuth0Login(username, password, cb) {

    auth0.client.login({
            realm: 'Username-Password-Authentication',
            username: username,
            password: password,
            scope: 'openid profile'
        },
        (err, authResult) => {
            if (!err) {
                localStorage.setItem('accessToken', authResult.accessToken);
            }
            cb(err, authResult.accessToken);
        }
    )
}

function handleLoginClick() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    doAuth0Login(username, password, (err, accessToken) => {
        if (err) {

            // TODO - show error somewhere
            return;
        }

        initializeGlueCore(accessToken);


    });
}

function handleDOMLoaded(event) {
    var loginBtn = document.getElementById("loginBtn");

    document.getElementById("updateBtn").addEventListener("click", invokeUpdateContact);

    document.getElementById("logoffBtn").addEventListener("click", () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
        document.getElementById("logoffBtn").style.display = "none";
        document.getElementById("loginBtn").style.display = "inline";
    });

    document.getElementById("doLoginBtn").addEventListener("click", handleLoginClick);
    var closeModalSpan = document.getElementsByClassName("close")[0];

    loginBtn.onclick = showLogin;
    closeModalSpan.onclick = hideLogin;

    window.onclick = function (event) {
        var modal = document.getElementById('myModal');
        if (event.target == modal) {
            hideLogin();
        }
    }
}

function showLogin() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
}

function hideLogin() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}

function initializeGlueCore(token) {
    console.log("initializing glue...");
    // Start glue library
    GlueCore({
            application: 'T42MSDynamicCRM',
            auth: {
                token: token
            },
            gateway: {
                ws: 'ws://gw3-dev-2.eu-west-1.elasticbeanstalk.com/gw',
                protocolVersion: 3
            }
        }).then((glueCore) => {
            // glue initialized successfully 
            // hide login window
            hideLogin();
            // update buttons
            document.getElementById("logoffBtn").style.display = "inline";
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("updateBtn").style.display = "inline";
            // TODO - change label to Welcome
            document.getElementById("welcomeMsg").textContent = "Welcome";
            // attach glueCore to window object
            window.glueCore = glueCore;

            console.log('glue initialized');
            // register methods
            registerMethods();
        })
        .catch(function (error) {
            // glue initialization failed - remove access token
            localStorage.removeItem('accessToken');
            console.log("Error in initializing glueCore");
            console.error(error);
        })
}

function registerMethods() {
    glueCore.agm.register("CRM.ResolveContact", (args, caller) => {
        document.getElementById('resultContent').textContent += "ResolveContact was invoked: " + JSON.stringify(args) + "\n";
    });
    glueCore.agm.register("CRM.UpdateContact", (args, caller) => {
        document.getElementById('resultContent').textContent += "UpdateContact was invoked: " + JSON.stringify(args) + "\n";
    });
}

function invokeUpdateContact() {
    glueCore.agm.invoke("Helper.UpdateContact", {
        emailAddress: 'user@domain.tld',
        fullName: 'John Doe',
        contactId: '9666a1a3-71d9-438a-b559-3ce7e38a629b'
    });
}