const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = 
functions.database.ref('/notifications/{notificationId}').onWrite(async (change,context) =>{
  const notif = context.params.notificationId;
  const notif_data = change.data();
  const ref_user = notif_data.notification_to;
  const notif_type = notif_data.type;
  const ref_user_as_key = ref_user._documentPath._parts[1];
  const getDeviceTokensPromise = admin.database()
  .ref(`users/${ref_user_as_key}/token`).once('value');
  const getNotificationTriggererProfilePromise = 
  admin.auth().getUser(notif_data.notification_from);

  let tokensSnapshot;
  let tokens;

  const results = await Promise.all([
    getDeviceTokensPromise,getNotificationTriggererProfilePromise]);
  tokensSnapshot = results[0];
  const triggerer = results[1];
  
  if(!tokensSnapshot.hasChildren()){
    return console.log('no tokens, feelsbadman');
  }

  let text = '';
  if(notif_type == 'like'){
    text = 'You have a new like on your post!';
  }else{
    text = 'You have a new comment on your post!';
  }

  let body = '';
  if(notif_type == 'like'){
    body = "liked";
  }else{
    body = "commented";
  }

  const payload = {
    notification:{
      title: text,
      body: `${triggerer.username} has ${body} your post`,
      icon : triggerer.profilePic
    }
  };

  tokens = Object.keys(tokensSnapshot.val());

  const response = await admin.messaging().sendToDevice(tokens,payload);

  const tokensToRemove = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failure sending notification to', tokens[index], error);
      // Cleanup the tokens who are not registered anymore.
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
    }
  });
  return Promise.all(tokensToRemove);
});