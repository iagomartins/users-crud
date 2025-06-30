"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <main className="full-width bg-primary">
      <div className="header-container full-width">
        <h1>CRUD de Usuários</h1>
        <span
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </span>
      </div>
    </main>
  );
}
