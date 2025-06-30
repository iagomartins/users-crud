"use client";
import { CSSProperties, useEffect, useState } from "react";
import axios from "axios";
import Customer from "@/types/Customer";
import { ModalEdit } from "@/components/ModalEdit";
import Header from "@/components/Header";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { ModalCreate } from "@/components/ModalCreate";

export const dynamic = "force-dynamic";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#ededed",
};

function Body() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ededed");
  const [users, setUsers] = useState<Customer[]>([]);
  const [user] = useState<Customer>(
    queryClient.getQueryData(["user"]) as Customer
  );

  function UpdateList() {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URI}/users`, config)
      .then(({ data }) => {
        setUsers(data.users);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URI}/users`, config)
      .then(({ data }) => {
        setUsers(data.users);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="users-page row-start-2 items-center sm:items-start">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="text-foreground flex">
          <span className="mr-5">Você está logado como: {user.name}</span>
          <ModalEdit userId={user.email} emitUpdate={UpdateList} />
        </div>
        <h1 className="text-foreground text-left full-width">
          Lista de usuários:
        </h1>
        {loading && (
          <div className="ofuscate-background">
            <ClipLoader
              color={color}
              loading={loading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        {users.length === 0 && <span>Não há usuários cadastrados...</span>}
        <table className="table-auto full-width bg-primary users-table">
          <thead>
            <tr>
              <th className="table-cell">Nome</th>
              <th className="table-cell">Email</th>
              <th className="table-cell">Tipo</th>
              {user?.type === "admin" && (
                <th className="table-cell edit-cell">Editar</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td className="table-cell">{u.name}</td>
                <td className="table-cell">{u.email}</td>
                <td className="table-cell">{u.type}</td>
                {user?.type === "admin" && (
                  <td className="table-cell cursor-pointer edit-cell">
                    <ModalEdit userId={u.email} emitUpdate={UpdateList} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <ModalCreate emitUpdate={UpdateList} />
      </main>
    </>
  );
}

export default function Dashboard() {
  return <Body />;
}
