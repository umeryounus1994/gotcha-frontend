import { useDisclosure } from "@mantine/hooks";
import { AppShell, Container, Text, Flex } from "@mantine/core";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RegulatorContext } from "../../../context/RegulatorContext";
import Button from "../../general/Button";
import toast from "react-hot-toast";

function RegulatorShell() {
  const [opened, { toggle }] = useDisclosure(false);
  const { regulator, setRegulator } = useContext(RegulatorContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("regulator");
    localStorage.removeItem("regulatorToken");
    setRegulator(null);
    toast.success("Logged out successfully");
    navigate("/regulator/login");
  };

  if (!regulator?.Role || regulator?.Role !== "Regulator" || !regulator?.token) {
    return <Navigate to={"/regulator/login"} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Text fw={600} size="lg">
          Regulator Dashboard
        </Text>
        <Flex gap="md" align="center">
          <Text size="sm" c="dimmed">
            {regulator?.FullName}
          </Text>
          <Button
            label="Logout"
            onClick={handleLogout}
            primary={false}
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Main bg={"#e4e5e6"} style={{ overflow: "hidden" }}>
        <Container p={0} m={"auto"} maw={1200}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default RegulatorShell;

