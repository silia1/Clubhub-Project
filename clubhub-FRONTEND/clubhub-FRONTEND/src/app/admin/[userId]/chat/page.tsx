"use client";
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';

const PubNub = dynamic(() => import('pubnub'), { ssr: false });

export default function ChatPage() {
    const [pubnubInstance, setPubnubInstance] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [token, setToken] = useState(null); // Track token state
    const userId = useMemo(() => uuidv4(), []); // Generate unique UUID once per session

    useEffect(() => {
        // Fetch message history based on channel
        const fetchMessageHistory = async () => {
            try {
                const response = await fetch(`http://localhost:4000/chats?channel=club_channel`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching message history:", error);
            }
        };

        // Fetch PubNub token once
        const fetchToken = async () => {
            try {
                const response = await fetch('/api/generateToken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    console.error('Token fetch failed:', response.statusText);
                    return;
                }

                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.error("Error fetching PubNub token:", error);
            }
        };

        fetchMessageHistory();
        if (!token) fetchToken();
    }, [userId, token]);

    // Setup PubNub once the token is available
    useEffect(() => {
        if (token && !pubnubInstance) {
            const setupPubNub = async () => {
                try {
                    const PubNubModule = await import('pubnub');
                    const pubnub = new PubNubModule.default({
                        publishKey: 'pub-c-92bc0c14-6c9c-4bf6-afe3-61e3c4d811bd',
                        subscribeKey: 'sub-c-aab62ae9-37e6-4cc0-b557-0417be0a34cb',
                        uuid: userId,
                        authKey: token,
                    });
                    setPubnubInstance(pubnub);

                    // Subscribe to the channel
                    pubnub.subscribe({ channels: ['club_channel'] });
                    pubnub.addListener({
                        message: (event) => {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                { messageId: uuidv4(), text: event.message.text, senderId: event.publisher },
                            ]);
                        },
                    });
                } catch (error) {
                    console.error('Error setting up PubNub:', error);
                }
            };
            setupPubNub();
        }
    }, [token, pubnubInstance, userId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        // Publish the message to PubNub
        if (pubnubInstance) {
            pubnubInstance.publish({
                channel: 'club_channel',
                message: { text: newMessage },
            });
        } else {
            console.error("PubNub instance is not initialized.");
        }

        // Save the message to the database
        try {
            await fetch('http://localhost:4000/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: uuidv4(),
                    senderId: userId,
                    text: newMessage,
                    channel: 'club_channel',
                }),
            });
        } catch (error) {
            console.error("Error saving message to database:", error);
        }

        // Clear the input field
        setNewMessage('');
    };

    return (
        <div className="chat-page">
            <h1>Club Chat</h1>
            <div className="chat-messages">
                {Array.isArray(messages) && messages.map((msg) => ( // Ensure messages is an array before mapping
                    <div key={msg.messageId}>{msg.text}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
