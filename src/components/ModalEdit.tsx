"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import Customer from "@/types/Customer";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  emitUpdate(): void;
}

export const ModalEdit: React.FC<Props> = ({ userId, emitUpdate }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const queryClient = useQueryClient();
  const [user] = useState<Customer>(
    queryClient.getQueryData(["user"]) as Customer
  );

  function handleUsernameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setNameValue(event.target.value);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordValue(event.target.value);
  }

  async function SubmitMutation() {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    const body = {
      name: nameValue,
      password: passwordValue,
    };

    const response = await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URI}/users/${userId}`, body, config)
      .catch(() => {
        setLoading(false);
      });

    if (response?.status === 200) {
      setOpen(false);
      setLoading(false);
      toast.success("Usuário atualizado!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      setLoading(false);
      toast.error("Não foi possível atualizar o usuário!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setNameValue("");
      setPasswordValue("");
    }
  }

  async function DeleteAccount() {
    const returnHome = user.email === userId;
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    const response = await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URI}/users/${userId}`, config)
      .catch(() => {
        setLoading(false);
      });

    if (response?.status === 200) {
      setOpen(false);
      setLoading(false);
      toast.success("Usuário excluído!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      emitUpdate();

      if (returnHome) router.push("/");
    } else {
      setLoading(false);
      toast.error("Não foi possível excluir o usuário!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  return (
    <div>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        <FontAwesomeIcon icon={faPencil} />
      </span>
      {loading && (
        <div className="ofuscate-background">
          <div className="loading-spinner">Carregando...</div>
        </div>
      )}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="full-width mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="font-semibold text-primary">
                      Atualizar conta
                    </DialogTitle>
                    <div className="mt-2">
                      <form action="#" method="POST" className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm/6 font-medium text-primary"
                          >
                            Nome
                          </label>
                          <div className="mt-2">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={nameValue}
                              onChange={handleUsernameChange}
                              required
                              autoComplete="email"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="password"
                              className="block text-sm/6 font-medium text-primary"
                            >
                              Senha
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              value={passwordValue}
                              onChange={handlePasswordChange}
                              required
                              autoComplete="current-password"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div>
                          <span
                            className="cursor-pointer flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={SubmitMutation}
                          >
                            Atualizar conta
                          </span>
                        </div>
                        <button
                          type="button"
                          data-autofocus
                          onClick={() => setOpen(false)}
                          className="mt-5 inline-flex full-width justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-dark shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancelar
                        </button>
                        {userId !== "admin@spsgroup.com.br" && (
                          <button
                            type="button"
                            data-autofocus
                            onClick={DeleteAccount}
                            className="mt-5 inline-flex full-width justify-center rounded-md bg-negative px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Excluir usuário
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
