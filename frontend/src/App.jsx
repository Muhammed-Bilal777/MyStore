import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Home } from "./components/pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProductDeails } from "./components/product/ProductDeails";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Toaster position="top-center" />
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDeails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
