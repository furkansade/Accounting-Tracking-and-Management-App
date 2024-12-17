
# Accounting Tracking and Management System

This project is an **Accounting Tracking and Management System** that helps businesses track their income and expenses, and manage their financial transactions efficiently. The system provides an easy-to-use interface that allows companies to streamline their financial operations. It is built with Node.js, Express.js, and MongoDB.

## Features

- **Profile**: Manage user profiles.
- **Site Information**: Edit system and site settings.
- **Users**: User management and authorization.
- **Clients**: Manage customers and suppliers.
- **Cash Register**: Record income and expenses, view detailed cash ledger, and filter transactions.
- **Employees**: Manage employee list and details.
- **Credit Cards**: Save credit card information, track limits and spending.
- **Loans**: Record and manage loans taken.
- **Daily Log**: Quickly record daily financial transactions.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/furkansade/Accounting-Tracking-and-Management-App
   cd Accounting-Tracking-and-Management-App
   ```

2. **Install Required Packages**:
   ```bash
   npm install
   ```

3. **Create the .env File**:
   Add a `.env` file to the project directory and fill it with the following information:
   ```
   CLOUDINARY_API_KEY=xxxxxxxxxxx
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
   CLOUDINARY_CLOUD_NAME=xxxxxx
   DB_URI=xxxxxxxxxx (MONGODB)
   JWT_SECRET=xxxxxxxxxx
   ```

4. **Start the Application**:
   ```bash
   npm run dev
   ```

## Usage

The system consists of the following sections:

### 1. Cash Register
- View income and expense transactions, add new transactions, or edit existing ones.
- Use the filtering feature to list transactions for specific date ranges.
- Export all transactions in Excel format.

### 2. Credit Cards
- Add credit cards and edit limits and billing dates.
- Track spending limits to control the financial situation.

### 3. Employees
- Add, view, and manage employee information.
- List employees who have left and manage active employees easily.

## License

This project is licensed under the MIT License.

---

For better usage of the system and to provide feedback, please feel free to [contact us](https://furkansadeuckun.com).
