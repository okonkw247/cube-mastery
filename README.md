# Digital Product Platform

A modern, high-performance web application built for digital product creators and entrepreneurs.

## 🚀 About This Project

This platform provides a seamless experience for selling and managing digital products with automatic revenue distribution, crypto payment support, and international payment processing.

## 🛠️ Tech Stack

This project is built with cutting-edge technologies:

- **Vite** - Lightning-fast build tool and development server
- **TypeScript** - Type-safe code for better reliability
- **React** - Modern UI library for building interactive interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible component library

## 📦 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.
- [Install Node.js with nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (recommended)

### Installation

Follow these steps to run the project locally:

```sh
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions and helpers
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles and Tailwind config
├── public/             # Static assets
└── index.html          # Entry HTML file
```

## 🌐 Deployment

This project can be deployed to any modern hosting platform:

- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- **Your own VPS/server**

### Deploy to Vercel

```sh
npm install -g vercel
vercel
```

### Build for Production

```sh
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=your_api_url
VITE_STRIPE_KEY=your_stripe_key
# Add other environment variables as needed
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please reach out via [your contact method].

---

Built with ❤️ for digital creators and entrepreneurs
