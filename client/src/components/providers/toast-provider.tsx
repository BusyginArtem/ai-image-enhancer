"use client";

import { useTheme } from "next-themes";
import { ToastContainer, ToastContainerProps } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const ClientSideToastContainer = (props: ToastContainerProps) => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      {...props}
      position="top-right"
      hideProgressBar
      theme={theme}
    />
  );
};

export default ClientSideToastContainer;
