import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login"); // Direct login page par le jayega
}
