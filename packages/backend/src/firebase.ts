import * as admin from 'firebase-admin';
import AWS from 'aws-sdk';

export function initializeFirebase(cb: (err?: any) => void) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const s3 = new AWS.S3();
    s3.getObject(
      {
        Bucket: 'micdrop-development-resources',
        Key: 'micdrop-auth-firebase-adminsdk-tkjxz-5ced3db717.json',
      },
      (err, data) => {
        if (err) {
          cb(err);
        } else if (data.Body) {
          const firebaseCredentials: admin.ServiceAccount = JSON.parse(
            data.Body.toString()
          );
          admin.initializeApp({
            credential: admin.credential.cert(firebaseCredentials),
          });
          cb();
        } else {
          cb('Failed to retrieve Firebase credentials from S3');
        }
      }
    );
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    cb();
  }
}

export default admin;
