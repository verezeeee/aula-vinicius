"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { isAuthenticated } from "@/utils/Auth";
import { redirect } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ListPage() {
  const auth = isAuthenticated();
  const [usersArray, setUsersArray] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const getUsers = await axios.get(
        "http://localhost:8000/api/user/listar",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const users = await getUsers.data.usuario;
      setUsersArray(users);
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (auth === false) {
      redirect("/");
    }
  }, [auth]);

  const UserWrapper = ({ user }: { user: any }) => {
    return (
      <Link href={`/user/${user.id}`}>
        <div className=" flex justify-center hover:scale-110 transition-transform duration-200 items-center w-full h-[50px] rounded-md bg-slate-500 cursor-pointer">
          {user.email}
        </div>
      </Link>
    );
  };

  return (
    <>
      <div
        className="
      h-[100vh] flex-col p-10 gap-2 w-full bg-gradient-radial from-blue-400 to-blue-800 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-center">Lista de Usuários</h1>
        <div className="flex flex-col gap-2 w-full h-[80%] overflow-y-auto">
          {usersArray &&
            usersArray.map((user, index) => {
              return <UserWrapper key={index} user={user} />;
            })}
        </div>
        <div></div>
      </div>
    </>
  );
}
