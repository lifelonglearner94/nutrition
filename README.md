# 🥗 NutriTrack - Smart Nutrition Tracking Application

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-lifelonglearner94%2Fnutrition-black.svg)](https://github.com/lifelonglearner94/nutrition)

A modern, web-based nutrition tracking application that helps you monitor your daily nutrient intake with intelligent calculations based on age and weight parameters.

## ✨ Features

- 🍎 **Food Database Integration**: Comprehensive nutrition database with detailed macro and micronutrient information
- 📊 **Smart Calculations**: Age and weight-based reference intake calculations for personalized nutrition goals
- 🎯 **Daily Tracking**: Log your daily food intake with precise quantity measurements
- 📈 **Visual Analytics**: Beautiful charts and visualizations powered by Chart.js
- 🌙 **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **Data Persistence**: SQLite database for reliable data storage and CSV export functionality
- 🔄 **Real-time Updates**: Live tracking of your daily nutrition progress

## 🏗️ Architecture

```
nutrition/
├── src/
│   ├── api/           # FastAPI route handlers
│   ├── data/          # Database and data management
│   ├── logic/         # Business logic and calculations
│   └── models.py      # Pydantic data models
├── static/            # CSS and JavaScript assets
├── templates/         # Jinja2 HTML templates
├── data/              # Database files and CSV exports
└── tests/             # Unit tests
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip or uv package manager (uv recommended for faster dependency management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lifelonglearner94/nutrition.git
   cd nutrition
   ```

2. **Install dependencies**

   Using pip:
   ```bash
   pip install -r requirements.txt
   ```

   Or using uv (recommended):
   ```bash
   uv sync
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000` to start tracking your nutrition!

## 🔧 Configuration

### Setting Up Your Profile

1. Click the settings button (⚙️) in the top navigation
2. Enter your age and weight for personalized nutrition calculations
3. Save your settings to enable accurate daily reference intake calculations

### Database Migration

If you need to migrate existing data:
```bash
python migrate_data.py
```

## 📊 API Endpoints

### Daily Intake Management
- `GET /api/daily-intake` - Retrieve today's nutrition summary
- `POST /api/daily-intake` - Add a new food entry
- `GET /api/daily-intake/count` - Get number of entries today

### Settings Management
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings

### Database Operations
- `GET /api/database` - Search food database
- `POST /api/database` - Add custom food entries

## 🧪 Testing

Run the test suite:
```bash
pytest tests/
```

Run with coverage:
```bash
pytest --cov=src tests/
```

## 🛠️ Development

### Project Structure

- **FastAPI Backend**: Modern, fast web framework with automatic API documentation
- **SQLite Database**: Lightweight, serverless database for data persistence
- **Jinja2 Templates**: Dynamic HTML rendering with template inheritance
- **Chart.js Integration**: Interactive charts for nutrition visualization
- **Responsive UI**: Mobile-first design with CSS Grid and Flexbox

### Key Components

- **Nutrition Calculator**: Age and weight-based daily reference intake calculations
- **Data Manager**: Handles database operations and CSV import/export
- **API Client**: External API integration for food data enrichment

### Development Setup

1. Install development dependencies:
   ```bash
   pip install -e ".[dev]"
   ```

2. Run in development mode with auto-reload:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📁 Data Management

### Supported Formats
- **CSV Import/Export**: Daily nutrition data and food database
- **SQLite Database**: Primary data storage with relational structure
- **JSON API**: RESTful data exchange format

### Data Structure
- **Nutrients**: Calories, carbohydrates, protein, fat, vitamins, minerals
- **User Settings**: Age, weight, dietary preferences
- **Daily Entries**: Food items, quantities, calculated values

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Chart.js for beautiful data visualizations
- Font Awesome for the iconography
- Google Fonts for typography

---

**Happy tracking! 🌱**

*Built with ❤️ for healthy living*
