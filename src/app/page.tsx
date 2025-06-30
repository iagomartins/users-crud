"use client";
import Image from "next/image";
import { useEffect, useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Customer from "@/types/Customer";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export const dynamic = "force-dynamic";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#ededed",
};

function Body() {
  const router = useRouter();
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ededed");
  const queryClient = useQueryClient();
  const user: Customer = {
    name: "",
    email: "",
    type: "",
    password: "",
  };
  useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return user;
    },
  });

  function handleUsernameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setUsernameValue(event.target.value);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPasswordValue(event.target.value);
  }

  async function SubmitLogin(): Promise<Customer> {
    setLoading(true);
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URI}/login`, {
        username: usernameValue,
        password: passwordValue,
      })
      .catch(() => {
        setLoading(false);
      });

    if (response?.status === 200) {
      router.push("/dashboard");
      queryClient.setQueryData(["user"], response.data.user);
      sessionStorage.setItem("user_token", response.data.token);
      return response.data;
    } else {
      setLoading(false);
      toast.error("Usuário ou senha inválidos!", {
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
      return user;
    }
  }

  useEffect(() => {
    sessionStorage.clear();
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URI}/login`, {
        username: process.env.NEXT_PUBLIC_API_USER,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      })
      .then(({ data }) => {
        sessionStorage.setItem("token", data.token);
      });
  }, []);

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Fake Store E-Commerce"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
          width={100}
          height={100}
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
          CRUD de usuários
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-200"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={usernameValue}
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
                className="block text-sm/6 font-medium text-gray-200"
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
              onClick={SubmitLogin}
            >
              Log in
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  return <Body />;
}
