"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const setEmail = (email: string) =>
    setFormState((prevState) => ({ ...prevState, email }));
  const setPassword = (password: string) =>
    setFormState((prevState) => ({ ...prevState, password }));
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((response) => response.json())
      .then((data) => {
        // if (data.usuario.token) {
        //   localStorage.setItem("token", data.usuario.token);
        //   localStorage.setItem("name", data.usuario.name);
        //   toast({
        //     position: "top-right",
        //     title: data.message,
        //     status: "success",
        //     duration: 5000,
        //     isClosable: true,
        //   });
        //   router.push("/listar");
        // }
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <main>
      <div className="h-[100vh] w-full bg-gradient-radial from-blue-400 to-blue-800 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg h-[23rem] w-[50%] sm:w-[30%] text-black">
          <form className="flex flex-col h-auto" onSubmit={handleSubmit}>
            <h1 className="sm:text-5xl text-2xl font-bold text-center">Login</h1>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 indent-4"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                value={formState.email}
                className="mt-1 p-2 border border-gray-300 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                value={formState.password}
                className="mt-1 mb-4 sm:mb-8 p-2 border border-gray-300 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-[1px] sm:gap-4">
            <button
              type="submit"
              className="mt-4 w-[100%] sm:w-[50%] h-[10%] sm:h-[3rem] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Entrar
            </button>
            <Link className="w-[100%] sm:w-[80%]" href="/cadastro">
              <button className="mt-4 w-[100%] sm:w-full h-[60%] sm:h-[3rem] bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cadastre-se
              </button>
            </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
