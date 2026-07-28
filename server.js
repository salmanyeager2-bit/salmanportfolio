require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_jwt_secret_change_me';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.error('MongoDB Error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// ===== REGISTER =====
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email aur password zaroori hain.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password kam se kam 6 characters ka hona chahiye.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.status === 'approved') {
                return res.status(400).json({ success: false, error: 'Ye email pehle se registered hai. Login karein.' });
            }
            if (existingUser.status === 'pending') {
                return res.status(400).json({ success: false, error: 'Aapka request pending hai. Approval ka wait karein.' });
            }
            if (existingUser.status === 'denied') {
                const token = crypto.randomBytes(32).toString('hex');
                existingUser.name = name;
                existingUser.password = password;
                existingUser.token = token;
                existingUser.status = 'pending';
                existingUser.deniedAt = undefined;
                await existingUser.save();

                await sendLoginRequestEmail(name, email, token, req);
                return res.json({ success: true, status: 'pending', message: 'Request re-sent! Owner ko email gaya hai.' });
            }
        }

        const token = crypto.randomBytes(32).toString('hex');
        const newUser = new User({ name, email, password, token });
        await newUser.save();

        await sendLoginRequestEmail(name, email, token, req);

        res.json({ success: true, status: 'pending', message: 'Account ban gaya! Owner ko email gaya hai. Approval ka wait karein.' });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Registration mein error aaya.' });
    }
});

// ===== LOGIN =====
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email aur password zaroori hain.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'User nahi mila. Pehle register karein.' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Galat password hai.' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({ success: false, status: 'pending', error: 'Aapka account approved nahi hua. Owner ka wait karein.' });
        }

        if (user.status === 'denied') {
            return res.status(403).json({ success: false, status: 'denied', error: 'Aapka access deny ho chuka hai.' });
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token: jwtToken,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Login mein error aaya.' });
    }
});

// ===== CHECK LOGIN STATUS =====
app.post('/api/check-status', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: true, status: 'not_found' });
        return res.json({ success: true, status: user.status });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Status check mein error aaya.' });
    }
});

// ===== APPROVE USER =====
app.get('/api/approve/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ token, status: 'pending' });

        if (!user) {
            return res.send(`
                <div style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
                    <h1 style="color:#ef4444;">Invalid or Expired Link</h1>
                    <p style="color:#64748b;">Ye link invalid ya expired hai.</p>
                </div>
            `);
        }

        user.status = 'approved';
        user.approvedAt = new Date();
        user.token = undefined;
        await user.save();

        res.send(`
            <div style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
                <h1 style="color:#22c55e;">Access Approved!</h1>
                <p style="color:#64748b;">${user.name} (${user.email}) ka access approve kar diya gaya hai.</p>
                <p style="color:#64748b;">Ab wo login kar sakta hai.</p>
                <a href="/" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;">Back to Portfolio</a>
            </div>
        `);

    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).send('Error approving user');
    }
});

// ===== DENY USER =====
app.get('/api/deny/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ token, status: 'pending' });

        if (!user) {
            return res.send(`
                <div style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
                    <h1 style="color:#ef4444;">Invalid or Expired Link</h1>
                    <p style="color:#64748b;">Ye link invalid ya expired hai.</p>
                </div>
            `);
        }

        user.status = 'denied';
        user.deniedAt = new Date();
        user.token = undefined;
        await user.save();

        res.send(`
            <div style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
                <h1 style="color:#ef4444;">Access Denied</h1>
                <p style="color:#64748b;">${user.name} (${user.email}) ka access deny kar diya gaya hai.</p>
                <a href="/" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;">Back to Portfolio</a>
            </div>
        `);

    } catch (error) {
        console.error('Deny error:', error);
        res.status(500).send('Error denying user');
    }
});

// ===== ALL USERS LIST (admin) =====
app.get('/api/users', async (req, res) => {
    try {
        const approved = await User.find({ status: 'approved' }).select('-password -token -__v');
        const pending = await User.find({ status: 'pending' }).select('-password -token -__v');
        const denied = await User.find({ status: 'denied' }).select('-password -token -__v');
        res.json({ approved, pending, denied });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Users load nahi ho sake.' });
    }
});

// ===== CONTACT FORM =====
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, phoneCode, subject, budget, services, deadline, message, brandColor } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, error: 'Name, email, subject aur message zaroori hain.' });
        }

        const servicesList = Array.isArray(services) ? services.join(', ') : (services || 'Not specified');
        const subjectMap = { 'web': 'Web Development', 'mobile': 'Mobile App', 'design': 'UI/UX Design', 'consulting': 'Consulting', 'other': 'Other' };
        const subjectText = subjectMap[subject] || subject;

        const htmlEmail = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;">New Contact Form Message</h1>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Portfolio Website</p>
            </div>
            <div style="padding:30px;">
                <div style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
                    <h2 style="color:#6366f1;margin:0 0 15px;font-size:18px;">Personal Information</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    ${phone ? `<p><strong>Phone:</strong> ${phoneCode || ''} ${phone}</p>` : ''}
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
                    <h2 style="color:#6366f1;margin:0 0 15px;font-size:18px;">Project Details</h2>
                    <p><strong>Subject:</strong> ${subjectText}</p>
                    ${budget ? `<p><strong>Budget:</strong> $${budget}</p>` : ''}
                    ${services !== 'Not specified' ? `<p><strong>Services:</strong> ${servicesList}</p>` : ''}
                    ${deadline ? `<p><strong>Deadline:</strong> ${deadline}</p>` : ''}
                    ${brandColor ? `<p><strong>Brand Color:</strong> <span style="display:inline-block;width:14px;height:14px;background:${brandColor};border-radius:50%;vertical-align:middle;margin-right:4px;"></span>${brandColor}</p>` : ''}
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:20px;">
                    <h2 style="color:#6366f1;margin:0 0 15px;font-size:18px;">Message</h2>
                    <p style="line-height:1.6;white-space:pre-wrap;">${message}</p>
                </div>
            </div>
            <div style="background:#f1f5f9;padding:15px 30px;text-align:center;">
                <p style="color:#94a3b8;margin:0;font-size:12px;">Sent from your Portfolio Contact Form</p>
            </div>
        </div>`;

        const plainText = `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phoneCode || ''} ${phone}\n` : ''}Subject: ${subjectText}\n${budget ? `Budget: $${budget}\n` : ''}${services !== 'Not specified' ? `Services: ${servicesList}\n` : ''}${deadline ? `Deadline: ${deadline}\n` : ''}${brandColor ? `Brand Color: ${brandColor}\n` : ''}\nMessage:\n${message}`;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { name: name, email: process.env.SENDER_EMAIL };
        sendSmtpEmail.to = [{ email: process.env.RECEIVER_EMAIL, name: 'Portfolio Owner' }];
        sendSmtpEmail.replyTo = { email: email, name: name };
        sendSmtpEmail.subject = `New Contact: ${subjectText} - ${name}`;
        sendSmtpEmail.htmlContent = htmlEmail;
        sendSmtpEmail.textContent = plainText;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent to:', process.env.RECEIVER_EMAIL);

        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Message bhejne mein error aaya.' });
    }
});

// Email helper for login requests
async function sendLoginRequestEmail(name, email, token, req) {
    const approveUrl = `${req.protocol}://${req.get('host')}/api/approve/${token}`;
    const denyUrl = `${req.protocol}://${req.get('host')}/api/deny/${token}`;

    const htmlEmail = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;">Login Request</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Portfolio Website</p>
        </div>
        <div style="padding:30px;">
            <div style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:20px;">
                <h2 style="color:#f59e0b;margin:0 0 15px;font-size:18px;">User Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            <p style="color:#64748b;line-height:1.6;">Kisi ne aapki portfolio website pe login request ki hai. Neeche diye gaye buttons se approve ya deny karein:</p>
            <div style="text-align:center;margin:30px 0;">
                <a href="${approveUrl}" style="display:inline-block;background:#22c55e;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin:0 8px;">Approve</a>
                <a href="${denyUrl}" style="display:inline-block;background:#ef4444;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin:0 8px;">Deny</a>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Request time: ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
        </div>
    </div>`;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'Portfolio Login', email: process.env.SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: process.env.RECEIVER_EMAIL, name: 'Portfolio Owner' }];
    sendSmtpEmail.subject = `Login Request: ${name} (${email})`;
    sendSmtpEmail.htmlContent = htmlEmail;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Login request email sent for:', email);
}

app.get('*', (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
