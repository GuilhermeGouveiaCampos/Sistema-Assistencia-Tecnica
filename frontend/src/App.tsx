import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
    </Routes>
  );
};

export default App;
