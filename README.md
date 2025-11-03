# Alliance Organization Website

Welcome to the official repository for the Alliance Organization's website. This project is a modern, feature-rich web application built with Next.js, TypeScript, and Supabase. It provides a seamless user experience with authentication, profile management, and real-time features.

![Alliance Organization](https://user-images.githubusercontent.com/106043444/288039120-14913a8c-a371-428c-8b9a-132830329898.png)

## ✨ Features

- **Next.js 16 App Router**: Utilizes the latest features of Next.js for optimal performance and developer experience.
- **Authentication**: Secure user login and registration using NextAuth.js.
- **Supabase Integration**: Leverages Supabase for database storage, and real-time capabilities.
- **Profile Management**: Users can update their profile information, including uploading and cropping avatars.
- **Real-time Chat**: A ChitChat widget for real-time communication.
- **Modern UI**: A beautiful and responsive user interface built with Tailwind CSS and Framer Motion.
- **TypeScript**: Ensures type safety and improves code quality.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: [npm](https://www.npmjs.com/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Ocennami/alliance-website.git
    cd alliance-website
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following variables. You can get these from your Supabase project settings.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret

    # Other
    NEXT_PUBLIC_VIDEO_URL=your_background_video_url
    ```

    See `SUPABASE_SETUP.md` for more details on setting up Supabase.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
alliance-website/
├── app/
│   ├── (auth)/           # Authentication-related pages
│   ├── (site)/           # Main site pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
├── lib/                  # Library files (e.g., Supabase client)
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── .eslintrc.json        # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

_Last updated: November 3, 2025_
