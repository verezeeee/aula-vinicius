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
  //Estados
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [email, setEmail] = useState("");
  const [userLogged, setUserLogged] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [usersArray, setUsersArray] = useState<any[]>([]);
  const [useEffectControl, setUseEffectControl] = useState(false);

  const auth = isAuthenticated();
  const toast = useToast();

  //Função para buscar os usuários
  //UseEffect é usado para buscar os usuários assim que a página é carregada
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
        setId(getMe.data.usuario[0].id);
      };

      const users = await getUsers.data.usuario;
      Me();
      setUsersArray(users);
    };
    fetchData();
  }, [useEffectControl]);
  //Segundo parametro do useEffect usado para que a função seja executada sempre que o estado useEffectControl for alterado

  useLayoutEffect(() => {
    if (auth === false) {
      redirect("/");
    }
  }, [auth]);

  //Componente para renderizar a tabela de usuários
  const UsersTable = ({ user }: any) => {
    return (
      <Tr>
        <Td>{user.name}</Td>
        <Td>{user.email}</Td>
        <Td>{user.id}</Td>
        {user.id == id ? (
          <Td>
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 
          "
              onClick={() => {
                setSelectedUser(user);
                onEditOpen();
              }}
            >
              Editar
            </button>
          </Td>
        ) : (
          <Td>
            <button className=" text-red-700 cursor-not-allowed" disabled>
              Você não pode editar
            </button>
          </Td>
        )}
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

  //Disclosures para abrir e fechar os modais de edição e exclusão
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

  //Função para deletar um usuário
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

  //Função para editar um usuário
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

  //Modais de edição e exclusão
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
                  window.location.href = "/";
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
                  {/* Checa se um usuário foi deletado no banco */}
                  {user.deleted_at === null && (
                    <UsersTable key={user.id} user={user} />
                  )}
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
