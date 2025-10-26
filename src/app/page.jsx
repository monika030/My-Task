// import Image from "next/image";
"use client";

 import UserList from "../component/userList";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function App() {
  return (
    <Provider store={store}>
      <UserList/>
    </Provider>
  );
}
