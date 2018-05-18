
//Configuration
var config = {
    apiKey: "AIzaSyCAqx-Bj2iaF2KQdNjlba-KurUwLMxYiWE",
    authDomain: "todo-f7799.firebaseapp.com",
    databaseURL: "https://todo-f7799.firebaseio.com",
    projectId: "todo-f7799",
    timestampsInSnapshots: true
};
//Firebase app initialization
firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots: true});
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var userId ="-1";
initApp = function() {
firebase.auth().onAuthStateChanged(function(user) {
listTodos.innerHTML="Loading...";
if (user) {
// User is signed in.
console.log(user.displayName);
var displayName = user.displayName;
var email = user.email;
var emailVerified = user.emailVerified;
var photoURL = user.photoURL;
var uid = user.uid;
var phoneNumber = user.phoneNumber;
var providerData = user.providerData;
userId = user.uid;
user.getIdToken().then(function(accessToken) {
  //document.getElementById('sign-in-status').textContent = 'Signed in';
document.getElementById('loginInfos').textContent = displayName;
document.getElementById('loginblock').style.display = 'none';
  /*document.getElementById('account-details').textContent = JSON.stringify({
    displayName: displayName,
    email: email,
    emailVerified: emailVerified,
    phoneNumber: phoneNumber,
    photoURL: photoURL,
    uid: uid,
    accessToken: accessToken,
    providerData: providerData
  }, null, '  ');*/
});
} else {
// User is signed out.
//document.getElementById('sign-in-status').textContent = 'Signed out';
//document.getElementById('account-details').textContent = 'null';
document.getElementById('loginblock').style.display = 'inline';
document.getElementById('signoutButton').style.display = 'none';
document.getElementById('loginInfos').textContent = "Log in for private tools";
userId="-1";
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
}
//start the listener for datas list
initListener();
}, function(error) {
alert(error.message);
});
};

window.addEventListener('load', function() {
       initApp();
       //document.querySelector('#firebaseui-auth-container').style.display = 'none';

     });

  // FirebaseUI config.signoutButton
  var uiConfig = {
    signInSuccessUrl: 'index.html',
    callbacks: {
      signInSuccess: function(currentUser, credential, redirectUrl) {
        document.getElementById('signoutButton').style.display = 'inline';
      //  document.getElementById('signinButton').style.display = 'none';
         // No redirect.
        return false; },
        uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        //document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    credentialHelper : firebaseui.auth.CredentialHelper.NONE,
    // Terms of service url.
    tosUrl: '<your-tos-url>'
  };



var todoText = document.querySelector("#todoText");
var addButton = document.querySelector("#addButton");
var listTodos = document.querySelector("#listTodos");
var deleteButton = document.querySelector("#delButton");
var signoutButton = document.querySelector("#signoutButton");
//var signinButton = document.querySelector("#signinButton");
//var checkedItems = document.querySelector("#checkedItem").checked;

todoText.addEventListener('keyup', handleSubmit);
addButton.addEventListener('click', handleSubmit);
signoutButton.addEventListener('click',signout);
//signinButton.addEventListener('click',signin);

//Database ref
const todoRef = firebase.firestore().collection('users');


function signin(e){
  if(document.querySelector('#firebaseui-auth-container').style.display = 'none'){
      document.querySelector('#firebaseui-auth-container').style.display = 'inline';}
  else{document.querySelector('#firebaseui-auth-container').style.display = 'none';}
  // An error happened.
};


function signout(e){
  firebase.auth().signOut().then(function() {
}).catch(function(error) {
  // An error happened.
});

}
//Handle submit
function handleSubmit(e) {

  if (e.keyCode !== 13 && e.type != "click") {
    return;
  }
  const todo = todoText.value;
  addButton.innerHTML = "Adding...";

  if (todo === "") {
    return;
  }
  //Add to the database$
  todoRef.doc(userId).collection('todos').add({
    title: todo,
    uid: userId,
    checked: false,
    createdAt: (new Date()).getTime()
      }).then(function(docRef) {
        todoText.value = "";
        addButton.innerHTML = "Add";
      }).catch(function(error) {
        console.log(error);
      })
  /*todoRef.add({
    title: todo,
    uid: userId,
    checked: false,
    createdAt: (new Date()).getTime()
  }).then(function(docRef) {
    todoText.value = "";
    addButton.innerHTML = "Add";
  }).catch(function(error) {
    console.log(error);
  })*/
}

// Listener for rendering todos
function initListener(){
todoRef.doc(userId).collection('todos').orderBy("checked").orderBy("createdAt", 'desc').onSnapshot(function(docSnapShot) {
  listTodos.innerHTML = "";
  docSnapShot.forEach(function(doc) {
    todo = doc.data();
    todo.id = doc.id;
    //Container to append the child for HTML
    var container = document.createElement("div");

    //Checkbox
    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("data-id", todo.id);
    checkBox.checked = todo.checked;
    checkBox.addEventListener('change', handleCheckToggle);

    //Title Block
    var titleBlock = document.createElement("span");
    if (todo.checked == true){
	    titleBlock.setAttribute("class","strikethrough");
    }
    titleBlock.innerHTML =   "&nbsp;" + todo.title + "&nbsp;";
    var delBlock = document.createElement("button");
    delBlock.setAttribute("class","close");
    delBlock.setAttribute("aria-label","Close");
    delBlock.setAttribute("data-id", todo.id);
    delBlock.addEventListener('click', handleDelete);
    var spandel = document.createElement("span");
    spandel.setAttribute("aria-hidden","true");
    spandel.innerHTML = "&times;";
    delBlock.appendChild(spandel);
	  //Append the childs
    container.appendChild(checkBox);
    container.appendChild(titleBlock);
    container.appendChild(delBlock);
    //Append to the list on HTML
    listTodos.appendChild(container);
  })
});
}
//On checkbox click update database
function handleCheckToggle(e) {
  var targetElement = e.target;
  var checked = targetElement.checked;
  var id = targetElement.dataset.id;
  todoRef.doc(userId).collection('todos').doc(id).update({
    checked: checked,
  })
}

function handleDelete(e) {
  var targetElement = e.target;
  var id = targetElement.parentElement.dataset.id;
  todoRef.doc(userId).collection('todos').doc(id).delete().then(function() {
	    console.log("Document successfully deleted!");
}).catch(function(error) {
	    console.error("Error removing document: ", error);
});
}
