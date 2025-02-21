<p align="center">
  <img src="https://github.com/user-attachments/assets/775d64fa-4c48-42ea-a7df-e50ef9200879" width="200">
</p>

# MediTrack - Medication Tracking App

## Overview
MediTrack is a comprehensive medication tracking application built with React Native and Expo. It helps users manage their medications, track doses, and maintain their medication schedule effectively.

## Features
- 💊 **Medication Management**: Add, edit, and delete medications
- 🕒 **Dose Tracking**: Track medication doses with time-based reminders
- 📱 **User-Friendly Interface**: Clean and intuitive design for easy navigation
- 🔐 **Secure Authentication**: Firebase-based user authentication
- 📅 **History Tracking**: View medication history and compliance
- 🔔 **Notifications**: Get reminders for medication doses
- 📊 **Status Monitoring**: Track taken and missed medications

## Tech Stack
- React Native
- Expo
- Firebase (Authentication & Firestore)
- React Navigation
- Moment.js
- React Native Toast Message

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd medi-track
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure Firebase:
- Create a Firebase project
- Enable Authentication and Firestore
- Create a .env file in the root directory with the following variables:
```env
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
EXPO_PUBLIC_MEASUREMENT_ID=your_measurement_id
```
- Replace the placeholder values with your Firebase configuration

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. **User Authentication**
   - Sign up with email and password
   - Log in to access medication tracking features

2. **Adding Medications**
   - Tap the "+" button to add new medication
   - Enter medication details (name, dose, schedule)
   - Select medication type and timing

3. **Tracking Doses**
   - Mark medications as taken or missed
   - View medication history
   - Monitor compliance through the dashboard

## Project Structure
```
medi-track/
├── app/                 # Main application screens
├── assets/             # Images and fonts
├── components/         # Reusable UI components
├── config/            # Configuration files
├── constant/          # Constants and theme
├── service/           # Utility services
```
## Screenshot
![Adsız tasarım](https://github.com/user-attachments/assets/32b0e0c0-3138-4320-aaaa-680257854771)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any questions or feedback, please open an issue in the repository.

---
Built with ❤️ using React Native and Expo
