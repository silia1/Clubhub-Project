import PubNub from 'pubnub';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId } = req.body;
    if (!userId) {
        console.error("No userId provided");
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const pubnub = new PubNub({
            publishKey: 'pub-c-92bc0c14-6c9c-4bf6-afe3-61e3c4d811bd',
            subscribeKey: 'sub-c-aab62ae9-37e6-4cc0-b557-0417be0a34cb',
            secretKey: 'sec-c-NzhiM2M0NmUtM2Q4Ni00YzZlLWI0YzMtZDg2ZTExYjg4ZjNk', // Replace with your actual secret key
            uuid: userId, // Ensure uuid is set to userId
        });

        const token = await pubnub.grantToken({
            ttl: 60,
            authorized_uuid: userId,
            resources: {
                channels: {
                    'club_channel': { read: true, write: true, join: true },
                },
            },
        });

        console.log('Token generated successfully:', token);
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating token:', error); // Log detailed error
        return res.status(500).json({ error: 'Failed to generate token' });
    }
}
