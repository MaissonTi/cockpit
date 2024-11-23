import UserList from "./components/user-list";

export default async function UserPage() {
  return (
    <div className="m-4 flex flex-col items-center justify-center">
      <UserList />
    </div>
  );
}
