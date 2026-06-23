<div align="center">
  <!-- You can update this banner image if needed -->
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  <br/>
  
  # XAI-Based Transparent Learning Models For Grievance Classification And Urgency Scoring In Social Media

  <p>
    An AI-driven dashboard that aggregates and analyzes civic and consumer grievances from social platforms (YouTube, Reddit). It automatically classifies text by sentiment, category, and urgency to help organizations quickly identify and resolve high-priority issues.
  </p>

  **[View Live Demo 🚀](https://amey710minor.vercel.app/)**
</div>

---

## 🌟 Features

- **Social Media Aggregation**: Fetches real-time comments and posts from YouTube (via YouTube Data API v3) and Reddit (r/India via OAuth).
- **Automated Classification**: Analyzes text to determine:
  - **Sentiment**: Positive, Negative, Neutral
  - **Urgency**: High, Medium, Low (Alerts triggered for high urgency)
  - **Category**: UPI/Payments, Customer Care, Service/Infrastructure, etc.
- **Interactive Dashboard**: Visualizes grievance data using interactive charts (Recharts).
- **Secure Authentication**: User authentication flow powered by Firebase.
- **Exportable Reports**: Generate and download PDF reports of the current dashboard view.

## 🛠️ Technology Stack

- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Export Tools**: html2canvas, jsPDF

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd minor_project2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Update your `.env.local` file with the necessary API keys (e.g., Firebase config, Gemini API key if applicable).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`.

## 🌐 Deployment

The project is currently deployed on Vercel. You can access the live application here:
- **Primary Domain**: [https://amey710minor.vercel.app](https://amey710minor.vercel.app)
- **Deployment URL**: [https://amey710minor-cjzsd1axi-ameyraut710s-projects.vercel.app](https://amey710minor-cjzsd1axi-ameyraut710s-projects.vercel.app)

---
*Developed as part of a Minor Project focusing on grievance classification and urgency scoring.*
