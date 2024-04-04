import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './util/http.js';

import Home from "./pages/Home";
import Map from "./pages/Map";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/map/:mapName" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);