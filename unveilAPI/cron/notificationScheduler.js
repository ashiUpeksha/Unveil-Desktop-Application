const cron = require('node-cron');
const pool = require('../db');
const admin = require('firebase-admin');

// TODO: Add your Firebase Admin SDK configuration
const serviceAccount = require('../config/firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = (token, payload) => {
  admin.messaging().sendToDevice(token, payload)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

const checkEventsAndSendNotifications = async () => {
  try {
    // 1. Get new events (created in the last 24 hours)
    const newEventsResult = await pool.query(
      `SELECT * FROM addnewevent WHERE created_date > NOW() - INTERVAL '24 hours'`
    );
    const newEvents = newEventsResult.rows;

    if (newEvents.length > 0) {
      const message = {
        notification: {
          title: 'New Events!',
          body: `${newEvents.length} new event(s) have been added in the last 24 hours.`
        },
        topic: 'new_events'
      };
      admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent new event notification:', response);
        })
        .catch((error) => {
          console.log('Error sending new event notification:', error);
        });
    }

    // 2. Get upcoming events (starting in the next 24 hours)
    const upcomingEventsResult = await pool.query(
      `SELECT * FROM addnewevent WHERE event_start_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'`
    );
    const upcomingEvents = upcomingEventsResult.rows;

    if (upcomingEvents.length > 0) {
      upcomingEvents.forEach(event => {
        const message = {
          notification: {
            title: 'Event Reminder',
            body: `Don't forget: ${event.event_name} starts tomorrow!`
          },
          topic: 'event_reminders'
        };
        admin.messaging().send(message)
          .then((response) => {
            console.log(`Successfully sent reminder for event ${event.event_id}:`, response);
          })
          .catch((error) => {
            console.log(`Error sending reminder for event ${event.event_id}:`, error);
          });
      });
    }
  } catch (error) {
    console.error('Error checking events and sending notifications:', error);
  }
};

// Schedule the cron job to run once a day at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('Running a daily check for new and upcoming events...');
  checkEventsAndSendNotifications();
}, {
  scheduled: true,
  timezone: "Asia/Colombo"
});

console.log('Notification scheduler started.');

module.exports = {
    checkEventsAndSendNotifications
};
