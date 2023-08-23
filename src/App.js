import { BrowserRouter ,Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Pages 
import { Home } from "./pages/home/Home";
import { Contact } from "./pages/contact/Contact";
import { Cart } from "./pages/cart/Cart";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Reset } from "./pages/auth/Reset";
import { Admin } from "./pages/admin/Admin";
import { CheckoutDetails } from "./pages/checkout/CheckoutDetails";
import { Checkout } from "./pages/checkout/Checkout";
import { CheckoutSuccess } from "./pages/checkout/CheckoutSuccess";
import { OrderHistory } from "./pages/orderHistory/OrderHistory";
import { OrderDetails } from "./pages/orderDetails/OrderDetails";

//Components
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { AdminOnlyRoute } from "./components/adminOnlyRoute/AdminOnlyRoute";
import { ProductDetails } from "./components/product/productDetaills/ProductDetails";
import { ReviewProducts } from "./components/reviewProducts/ReviewProducts";
import { NotFound } from "./pages/notFound/NotFound";
import { Products } from "./pages/Products/Products";



function App() {
  return (
   <>
    <ToastContainer/>
    <BrowserRouter>
      <Header />
        <Routes>
          <Route  path="/" element={<Home /> }/>
          <Route  path="/contact" element={ <Contact />} />
          <Route  path="/login" element={<Login/> } />
          <Route  path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset /> } />

          <Route path="/admin/*" element={<AdminOnlyRoute> <Admin />  </AdminOnlyRoute> } /> 
          <Route path="/products" element={<Products />} />
          <Route path="/product-details/:id" element={<ProductDetails /> } />
          <Route path="/cart" element={<Cart /> } />
          <Route path="/checkout-details" element={<CheckoutDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/review-product/:id" element={<ReviewProducts />} />
          <Route path="*" element={<NotFound />} />
          
          
        </Routes>
      <Footer />
    </BrowserRouter>
   </> 
  )
}

export default App;
