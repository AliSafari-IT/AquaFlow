# AquaFlow - Professional Hydrological Modeling Platform

**AquaFlow** is a comprehensive web-based hydrological modeling platform designed for watershed analysis, rainfall-runoff simulation, and hydrograph visualization. Built with modern technologies, AquaFlow provides both educational and professional-grade tools for hydrological engineers, researchers, and students.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌊 Overview

AquaFlow offers a complete suite of hydrological modeling tools with an intuitive, professional interface. The platform supports multiple modeling approaches, real-world data integration, and advanced visualization capabilities for comprehensive watershed analysis.

### Key Capabilities
- **Multiple Modeling Approaches** - Simple and advanced hydrological algorithms
- **Real Data Integration** - CSV data loading and model validation
- **Professional Visualization** - Interactive charts with model-observation comparison
- **Modern Architecture** - Route-based navigation with clean, maintainable code
- **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🚀 Features

### 🏠 **Landing Page**
- Professional welcome interface with feature overview
- Guided navigation to different modeling approaches
- Clean, modern design with dark mode support

### 🌧️ **Simple Rainfall-Runoff Model** (`/simple`)
- Basic linear reservoir model for quick watershed analysis
- Adjustable precipitation intensity and duration
- Catchment area and runoff coefficient parameters
- Real-time hydrograph generation and visualization

### ⚙️ **Advanced Hydrological Models** (`/advanced`)
- Multiple modeling algorithms:
  - **SCS Curve Number Method**
  - **Rational Method**
  - **Unit Hydrograph Method**
- Comprehensive watershed parameters:
  - Watershed slope and length
  - Antecedent moisture conditions
  - Evapotranspiration rates
  - Base flow components
- Multi-reservoir routing capabilities

### 📊 **CSV Data Analysis** (`/csv`)
- Load real-world hydrograph data from CSV files
- Automatic data parsing and validation
- Statistical summary (peak flow, duration, data points)
- Standalone visualization and analysis

### 🔄 **Model-Observation Comparison**
- Overlay CSV observation data on modeled results
- Visual distinction between modeled (blue solid) and observed (red dashed) data
- Direct model validation and performance assessment
- Persistent data sharing across all modeling approaches

### 📚 **Help & Documentation** (`/help`)
- Comprehensive user guide with semantic sections
- Model documentation and parameter explanations
- FAQ section for common questions
- Hash-based navigation for quick reference

### ℹ️ **About Page** (`/about`)
- Project overview and mission statement
- Technology stack information
- Feature highlights and capabilities

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **React Router** for professional route-based navigation
- **Chart.js** with React integration for interactive visualizations
- **Material-UI** components for consistent design
- **CSS Variables** for comprehensive theming and dark mode
- **Responsive Design** with mobile-first approach

### **Backend**
- **ASP.NET Core 8** Web API for high-performance server
- **RESTful JSON API** for clean client-server communication
- **Advanced Hydrological Algorithms** with multiple model implementations
- **Robust Error Handling** and validation

### **Architecture**
- **Single Page Application (SPA)** with client-side routing
- **Component-Based Architecture** for maintainable code
- **Shared State Management** for cross-page data persistence
- **Professional UI/UX** following modern web standards

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **.NET 8 SDK**
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AquaFlow.git
cd AquaFlow
```

### 2. Start the Backend API

```bash
cd backend/AquaFlow.Backend
dotnet restore
dotnet watch run
```

The API will be available at `http://localhost:5185/`

### 3. Start the Frontend

```bash
cd frontend/aquaflow-frontend
npm install
npm start
```

The application will open at `http://localhost:3000/`

---

## 📦 Project Structure

```
AquaFlow/
│
├── backend/                    # ASP.NET Core Web API
│   └── AquaFlow.Backend/
│       ├── Controllers/        # API endpoints
│       ├── Models/            # Data models
│       ├── Services/          # Business logic
│       └── Program.cs         # Application entry point
│
├── frontend/                   # React TypeScript Application
│   └── aquaflow-frontend/
│       ├── public/            # Static assets
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── TopNavBar.tsx
│       │   │   ├── HydrographChart.tsx
│       │   │   ├── PrecipitationForm.tsx
│       │   │   ├── AdvancedHydrologyForm.tsx
│       │   │   ├── CsvHydrographLoader.tsx
│       │   │   ├── HelpPage.tsx
│       │   │   └── AboutPage.tsx
│       │   ├── styles/        # CSS and styling
│       │   │   ├── variables.css
│       │   │   └── base-styles.css
│       │   ├── App.tsx        # Main application component
│       │   └── index.tsx      # Application entry point
│       ├── package.json       # Dependencies and scripts
│       └── tsconfig.json      # TypeScript configuration
│
└── README.md                  # This file
```

---

## 🔬 Hydrological Models

### **Simple Model**
- **Algorithm:** Linear reservoir with constant parameters
- **Use Case:** Quick watershed analysis and educational purposes
- **Parameters:**
  - Precipitation intensity (mm/hr)
  - Storm duration (hours)
  - Catchment area (km²)
  - Runoff coefficient
  - Linear reservoir constant (K)

### **Advanced Models**

#### **SCS Curve Number Method**
- Industry-standard method for runoff estimation
- Accounts for soil type and land use conditions
- Antecedent moisture condition adjustments

#### **Rational Method**
- Peak discharge estimation for small watersheds
- Time of concentration calculations
- Suitable for urban hydrology applications

#### **Unit Hydrograph Method**
- Synthetic unit hydrograph generation
- Multiple reservoir routing
- Complex watershed response modeling

---

## 📊 Data Integration

### **CSV Data Format**
AquaFlow accepts CSV files with the following structure:

```csv
year,month,day,hour,timeHours,flowCubicMetersPerSecond
2023,1,1,0,0,5.2
2023,1,1,1,1,7.8
2023,1,1,2,2,12.4
...
```

### **Supported Features**
- Automatic data validation and parsing
- Statistical analysis (peak flow, duration, data points)
- Model-observation comparison and overlay
- Data persistence across modeling sessions

---

## 🎨 User Interface

### **Design Principles**
- **Professional Appearance** - Clean, modern interface suitable for technical users
- **Intuitive Navigation** - Clear routing with bookmarkable URLs
- **Responsive Design** - Optimized for desktop and mobile devices
- **Accessibility** - Semantic HTML and proper contrast ratios

### **Theme Support**
- **Light Mode** - Professional light theme for daytime use
- **Dark Mode** - Eye-friendly dark theme for extended sessions
- **CSS Variables** - Consistent theming throughout the application
- **Smooth Transitions** - Polished animations and hover effects

---

## 🚦 API Endpoints

### **Simple Hydrology**
```
POST /api/hydrology
Content-Type: application/json

{
  "intensity": 25.0,
  "duration": 6.0,
  "catchmentAreaKm2": 10.0,
  "runoffCoefficient": 0.3,
  "linearReservoirConstantK": 2.0,
  "timeStepHours": 0.5,
  "initialStorageCubicMeters": 0.0
}
```

### **Advanced Hydrology**
```
POST /api/hydrology/advanced
Content-Type: application/json

{
  "intensityMmPerHour": 25.0,
  "durationHours": 6.0,
  "catchmentAreaKm2": 10.0,
  "watershedSlopePercent": 2.5,
  "watershedLengthKm": 5.0,
  "curveNumber": 75,
  "antecedentMoisture": 2,
  "selectedModel": 0,
  "evapotranspirationMmPerHour": 0.2,
  "baseFlowCubicMetersPerSecond": 1.0
}
```

---

## 🧪 Usage Examples

### **Basic Workflow**
1. **Navigate to Landing Page** - Overview of available features
2. **Choose Modeling Approach** - Simple or Advanced methods
3. **Input Parameters** - Watershed and precipitation characteristics
4. **Generate Results** - Real-time hydrograph calculation
5. **Analyze Output** - Interactive charts and statistical summaries

### **Model Validation Workflow**
1. **Load Observation Data** - Upload CSV file with real measurements
2. **Run Hydrological Model** - Generate predicted hydrograph
3. **Compare Results** - Overlay observed vs. modeled data
4. **Assess Performance** - Visual and statistical model evaluation

---

## 🔧 Development

### **Available Scripts**

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run lint       # Check code quality
```

#### Backend
```bash
dotnet run         # Start development server
dotnet build       # Build application
dotnet test        # Run tests
dotnet watch run   # Start with hot reload
```

### **Code Quality**
- **TypeScript** for type safety and better developer experience
- **ESLint** and **Prettier** for consistent code formatting
- **Component-based architecture** for maintainable React code
- **RESTful API design** following industry best practices

---

## 🤝 Contributing

We welcome contributions from the hydrological modeling and web development communities!

### **How to Contribute**
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Areas for Contribution**
- Additional hydrological models and algorithms
- Enhanced data visualization features
- Mobile application development
- Performance optimizations
- Documentation improvements
- Bug fixes and testing

---

## 📈 Roadmap

### **Planned Features**
- [ ] **GIS Integration** - Spatial data support and watershed delineation
- [ ] **Database Integration** - Persistent data storage and user accounts
- [ ] **Advanced Analytics** - Statistical analysis and model calibration
- [ ] **Export Capabilities** - PDF reports and data export
- [ ] **Real-time Data** - Integration with weather and stream gauge APIs
- [ ] **Mobile App** - Native mobile application development

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Hydrological Community** - For established modeling methods and best practices
- **Open Source Libraries** - React, Chart.js, Material-UI, and ASP.NET Core
- **Educational Institutions** - For supporting water resources education and research

---

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues** - [Create an issue](https://github.com/YOUR_USERNAME/AquaFlow/issues)
- **Documentation** - Visit `/help` page in the application
- **Email** - your.email@example.com

---

**AquaFlow** - *Professional Hydrological Modeling Made Accessible*