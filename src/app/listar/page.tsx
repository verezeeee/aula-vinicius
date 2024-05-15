"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { isAuthenticated } from "@/utils/Auth";
import { redirect } from "next/navigation";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Input,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";

export default function ListPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userLogged, setUserLogged] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>(null); // [1
  const auth = isAuthenticated();
  const [usersArray, setUsersArray] = useState<any[]>([]);
  const [useEffectControl, setUseEffectControl] = useState(false); // [2
  const toast = useToast();

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

      const Me = async () => {
        const getMe = await axios.get("http://localhost:8000/api/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserLogged(getMe.data.usuario[0].name);
      };

      const users = await getUsers.data.usuario;
      Me();
      setUsersArray(users);
    };
    fetchData();
  }, [useEffectControl]);

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
        <Td>{user.id}</Td>
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

  const onDeleteConfirm = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/user/deletar/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUseEffectControl(!useEffectControl);
        toast({
          position: "top-right",
          title: res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          position: "top-right",
          title: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const onEditConfirm = (id: number) => {
    axios
      .put(
        `http://localhost:8000/api/user/atualizar/${id}`,
        {
          name: name,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setUseEffectControl(!useEffectControl);
        toast({
          position: "top-right",
          title: res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          position: "top-right",
          title: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const userEditModal = (user: any) => {
    return (
      <Modal isCentered isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent className="py-4 px-12">
          <ModalHeader>Editar usuário</ModalHeader>
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
        </ModalContent>
      </Modal>
    );
  };

  const userDeleteModal = (user: any) => {
    return (
      <Modal isCentered isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent className="p-4">
          <ModalHeader>Excluir usuário</ModalHeader>
          <ModalBody>
            <p>Deseja realmente excluir o usuário {user.name}?</p>
          </ModalBody>
          <button
            onClick={() => {
              onDeleteConfirm(user.id);
              onDeleteClose();
            }}
            className="bg-red-500 w-full mb-4 text-white rounded-md p-2 mt-6"
          >
            Confirmar
          </button>
        </ModalContent>
      </Modal>
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
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold text-center">Lista de Usuários</h1>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-center">
              {userLogged || "Usuário"}
            </h1>
            <Avatar
              name={userLogged || "Usuário"}
              src="https://bit.ly/broken-link"
              size="md"
            />
            <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setUseEffectControl(!useEffectControl);
                  redirect("/");
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
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
                <Th>Id</Th>
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
