# AquaFlow Interactive

**AquaFlow Interactive** is a web-based educational tool for simulating and visualizing watershed hydrology.  
Built as a modern fullstack app (React + .NET), AquaFlow lets users adjust rainfall inputs and see the resulting streamflow hydrograph for a conceptual basin.

---

## 🚀 Features

- Adjustable precipitation intensity and duration
- Simple conceptual hydrological model (linear reservoir)
- Real-time hydrograph visualization
- Modern, responsive React frontend
- Fast .NET Core backend API

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Chart.js, (Material-UI or Tailwind CSS)
- **Backend:** ASP.NET Core WebAPI (.NET 8+)
- **API:** RESTful JSON

---

## 💡 MVP Demo

1. User sets precipitation **intensity** (mm/hr) and **duration** (hr)
2. App sends input to backend
3. Backend runs a simple rainfall-runoff model
4. Returns a time series (hydrograph)
5. Frontend charts the flow vs. time

---

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aquaflow.git
cd aquaflow
````

### 2. Start the Backend API

```bash
cd backend/AquaFlow.Backend
dotnet restore
dotnet watch run
```

* Runs at `http://localhost:5000/` by default

### 3. Start the Frontend

```bash
cd ../../frontend/aquaflow-frontend
npm install
npm start
```

* Runs at `http://localhost:3000/` by default

---

## 📦 Project Structure

```
aquaflow/
│
├── backend/           # ASP.NET Core Web API (C#)
│   └── AquaFlow.Backend/
│
├── frontend/          # React TypeScript app
│   └── aquaflow-frontend/
│
└── README.md
```

---

## 🔬 Hydrological Model

* **Model:** Linear reservoir, conceptual runoff
* **Inputs:** Precipitation intensity (mm/hr), duration (hr)
* **Outputs:** Discharge hydrograph (m³/s) as time series

---

## 🤝 Contributing

Pull requests and feedback welcome!
Ideas for improvements or more complex models? Open an issue or fork and PR.

---

## 📄 License

[MIT](LICENSE)
Copyright © \[Your Name]

---

**AquaFlow Interactive – See the flow!**