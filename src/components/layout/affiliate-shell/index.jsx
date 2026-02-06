import { AppShell, Container, Text, Flex } from "@mantine/core";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AffiliateContext } from "../../../context/AffiliateContext";
import Button from "../../general/Button";
import toast from "react-hot-toast";

function AffiliateShell() {
  const { affiliate, setAffiliate } = useContext(AffiliateContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("affiliate_data");
    localStorage.removeItem("affiliate_token");
    setAffiliate(null);
    toast.success("Logged out successfully");
    navigate("/affiliate/login");
  };

  if (!affiliate?.role || affiliate?.role !== "affiliate" || !affiliate?.token) {
    return <Navigate to={"/affiliate/login"} />;
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Text fw={600} size="lg">
          Affiliate Sales Dashboard
        </Text>
        <Flex gap="md" align="center">
          <Text size="sm" c="dimmed">
            User: {affiliate?.FullName || affiliate?.Email}
          </Text>
          <Button label="Logout" onClick={handleLogout} primary={false} />
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

export default AffiliateShell;
