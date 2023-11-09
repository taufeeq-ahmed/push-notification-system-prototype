const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv');
const { clear } = require("console");
dotenv.config()


const app = express();
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
	"mailto:test@test.com",
	publicVapidKey,
	privateVapidKey
);
const notification = {
	title: "Cogoport 1",
	body: "CHeck out our best rates at Cogoport ",
	icon: "https://cdn.cogoport.io/cms-prod/cogo_public/vault/original/cogoports-new-g-logo.png",
	scheduledTime: new Date('2023-11-09 16:16:40')
}

let subscriptions = []
const getSubscriptions = async () => {
	let { data: rows, error } = await supabase.from('subscriptions').select('*');
	subscriptions = rows.map((row) => row.subscription_object)
}
getSubscriptions()

const task = cron.schedule('* * * * * *', () => {
	const currentTime = new Date();
	console.log(currentTime)
	if (currentTime >= notification.scheduledTime) {
		console.log('executed')
		subscriptions.map((subscription) => {
			const notificationData = JSON.stringify(notification);
			try {
				webpush.sendNotification(subscription, notificationData).catch(err => console.log("Not sent"))
				task.destroy().catch(err => console.log("Not sent"))
			} catch (err) {
				console.error(err)
			}
		})
	}

}, { scheduled: false })
task.start();


app.listen(process.env.PORT_NUMBER, () => console.log(`Server started on port ${process.env.PORT_NUMBER}`));
