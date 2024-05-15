"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { isAuthenticated } from "@/utils/Auth";
import { redirect } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import ModalComponent, { DeleteModal } from "@/components/Modal";

export default function ListPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null); // [1
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

  const UsersTable = ({ user }: any) => {
    return (
      <Tr>
        <Td>{user.name}</Td>
        <Td>{user.email}</Td>
        <Td>
          <button
            onClick={() => {
              setSelectedUser(user);
              onEditOpen();
              setName(user.name);
              setEmail(user.email);
            }}
          >
            Editar
          </button>
        </Td>
        <Td>
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 
          "
            onClick={() => {
              setSelectedUser(user);
              onDeleteOpen();
            }}
          >
            Excluir
          </button>
        </Td>
      </Tr>
    );
  };

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const onConfirm = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/user/deletar/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onEditConfirm = (id: number) => {
    axios
      .put(`http://localhost:8000/api/user/atualizar/${id}`, {
        body: JSON.stringify({
          name: name,
          email: email,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const userEditModal = (user: any) => {
    return (
      <ModalComponent
        header={"Editar usuário"}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <label className="text-lg font-bold text-gray-800">Nome</label>
        <Input
          className="mb-3"
          placeholder="Nome"
          onChange={(_e) => {
            setName(_e.target.value);
          }}
          value={name}
        />
        <label className="text-lg font-bold text-gray-800">Email</label>
        <Input
          placeholder="Email"
          onChange={(_e) => {
            setEmail(_e.target.value);
          }}
          value={email}
        />
        <button
          onClick={() => {
            onEditConfirm(user.id);
            onEditClose();
          }}
          className="bg-blue-500 w-full mb-4 text-white rounded-md p-2 mt-6"
        >
          Salvar
        </button>
      </ModalComponent>
    );
  };

  const userDeleteModal = (user: any) => {
    return (
      <DeleteModal
        header={"Excluir usuário"}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={() => {
          onConfirm(user.id);
          onDeleteClose();
        }}
        body={`Tem certeza que deseja excluir o usuário ${user.name}?`}
        children={undefined}
      />
    );
  };

  return (
    <>
      {selectedUser && userEditModal(selectedUser)}
      {selectedUser && userDeleteModal(selectedUser)}
      <div
        className="
      h-[100vh] flex-col p-10 gap-2 w-full bg-gradient-radial from-blue-400 to-blue-800 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-center">Lista de Usuários</h1>
        <div className="flex flex-col gap-2 w-full h-[80%] overflow-y-auto">
          <Table
            className="w-full min-w-max shadow-lg rounded-lg overflow-hidden bg-slate-50
          "
            variant="simple"
          >
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Editar</Th>
                <Th>Excluir</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersArray.map((user) => (
                <>
                  <UsersTable key={user.id} user={user} />
                </>
              ))}
            </Tbody>
          </Table>
        </div>
        <div></div>
      </div>
    </>
  );
}
