# Shopsy - E-commerce Platform

A comprehensive e-commerce platform built with React 18+ featuring both user interface and admin dashboard.

## 🚀 Features

### 👥 User Interface (`/user`)

- **Product Catalog**: Browse products with search, filtering, and pagination
- **Product Details**: Detailed product information with reviews and ratings
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete order placement with customer information
- **Order History**: Track order status and view past purchases
- **User Profile**: Manage personal information and preferences
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🔧 Admin Dashboard (`/admin`)

- **Dashboard Overview**: Comprehensive analytics with charts and KPIs
- **Product Management**: CRUD operations for products and pricing
- **Order Management**: Track and update order status
- **Customer Management**: View and manage customer information
- **Marketing Management**: Campaigns, events, content, and channels
- **KPI & Analytics**: Performance metrics and weekly targets
- **Internal Management**: Tasks, team members, and discount policies
- **Reports**: Survey statistics and analytics charts
- **Real-time Updates**: Live notifications and auto-refresh

## 🛠️ Tech Stack

- **Frontend**: React 18+ with modern hooks
- **Routing**: React Router v6 with protected routes
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with validation
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React icons
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with interceptors

## 📁 Project Structure

```
src/
├── api/
│   └── client.js                 # API client with comprehensive services
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── AdminHeader.jsx
│   │   └── AdminSidebar.jsx
│   ├── user/                     # User interface components
│   │   └── UserNavbar.jsx
│   └── [existing components]/    # Original components
├── contexts/
│   ├── AuthContext.jsx           # Authentication context
│   └── QueryProvider.jsx         # React Query provider
├── hooks/
│   └── useCart.js                # Shopping cart context
├── layouts/
│   ├── AdminLayout.jsx           # Admin layout wrapper
│   └── UserLayout.jsx            # User layout wrapper
├── pages/
│   ├── admin/                    # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── ProductsManagement.jsx
│   │   ├── OrdersManagement.jsx
│   │   ├── CustomersManagement.jsx
│   │   ├── MarketingManagement.jsx
│   │   ├── KPIManagement.jsx
│   │   ├── InternalManagement.jsx
│   │   └── ReportsPage.jsx
│   └── user/                     # User pages
│       ├── HomePage.jsx
│       ├── ProductsPage.jsx
│       ├── ProductDetailPage.jsx
│       ├── CartPage.jsx
│       ├── CheckoutPage.jsx
│       ├── OrderHistoryPage.jsx
│       └── ProfilePage.jsx
└── router/
    └── AppRouter.jsx             # Main routing configuration
```

## 🔐 Authentication & Authorization

- **JWT Token**: Stored in localStorage with automatic refresh
- **Role-based Access**: Admin vs User permissions
- **Protected Routes**: Route guards for admin pages
- **Auto-logout**: Token expiration handling

## 📊 API Integration

The application includes comprehensive API services for:

- **Authentication**: Login, register, token refresh
- **Products**: CRUD operations, pricing, active products
- **Orders**: Order management, status updates, customer orders
- **Customers**: Customer management and profiles
- **Feedback**: Product reviews and ratings
- **Marketing**: Campaigns, events, content, channels
- **KPI**: Definitions, measurements, targets
- **Internal**: Tasks, team members, policies
- **Analytics**: Dashboard data, revenue charts, statistics

## 🎨 UI/UX Features

### User Interface

- Clean, modern e-commerce design
- Responsive mobile-first layout
- Product search and filtering
- Shopping cart with real-time updates
- Smooth checkout flow
- Order tracking and history

### Admin Dashboard

- Dark/light mode toggle
- Sidebar navigation
- Data tables with pagination
- Interactive charts and analytics
- Modal forms for CRUD operations
- Toast notifications
- Real-time data updates

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with:

   ```
   VITE_API_URL=http://localhost:5091
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - User Interface: `http://localhost:5173/`
   - Admin Dashboard: `http://localhost:5173/admin/login`

## 📱 Routes

### User Routes

- `/` - Home page
- `/products` - Product catalog
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/profile` - User profile

### Admin Routes

- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/marketing` - Marketing management
- `/admin/kpi` - KPI management
- `/admin/internal` - Internal management
- `/admin/reports` - Reports and analytics

## 🔧 Configuration

### API Base URL

Update the API base URL in `src/api/client.js` or set the `VITE_API_URL` environment variable.

### Authentication

The app expects JWT tokens from your backend API. Update the authentication endpoints in `src/api/client.js` to match your backend.

### Styling

The app uses Tailwind CSS. Customize the design system by modifying the Tailwind configuration in `tailwind.config.js`.

## 📈 Performance Features

- **React Query**: Automatic caching and background updates
- **Code Splitting**: Route-based code splitting
- **Optimistic Updates**: Immediate UI updates with rollback
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Skeleton loaders and spinners

## 🔄 Real-time Features

- **Auto-refresh**: Data automatically refreshes at intervals
- **Live Notifications**: Toast notifications for actions
- **Real-time Updates**: Order status and inventory updates
- **Live Analytics**: Dashboard metrics update in real-time

## 🧪 Testing

The application is structured to support testing:

- Component isolation for unit testing
- API mocking with React Query
- User interaction testing with React Hook Form
- Accessibility testing with semantic HTML

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
