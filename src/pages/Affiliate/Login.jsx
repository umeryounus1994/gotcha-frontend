import { Image, PasswordInput, Stack, Text, Title, Anchor, Group } from "@mantine/core";
import Button from "../../components/general/Button";
import InputField from "../../components/general/InputField";
import logo from "/logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AffiliateContext } from "../../context/AffiliateContext";
import { Lock, Mail } from "lucide-react";

const AffiliateLogin = () => {
  const navigate = useNavigate();
  const { affiliate, setAffiliate } = useContext(AffiliateContext);

  const form = useForm({
    initialValues: {
      Email: "",
      Password: "",
    },
    validate: {
      Email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      Password: (value) => (value?.length > 0 ? null : "Enter Password"),
    },
  });

  const handleLogin = useMutation(
    async (values) => {
      return axios.post(backendUrl + `/affiliates/login`, values);
    },
    {
      onSuccess: (response) => {
        if (response.data.success) {
          localStorage.setItem("affiliate_data", JSON.stringify(response.data.data));
          localStorage.setItem("affiliate_token", response.data.token);
          setAffiliate({
            ...response.data.data,
            role: "affiliate",
            token: response.data.token,
          });
          toast.success(response.data.message);
          navigate("/affiliate/dashboard");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Login failed. Please try again."
        );
      },
    }
  );

  if (affiliate?.role === "affiliate" && affiliate?.token) {
    return <Navigate to={"/affiliate/dashboard"} />;
  }

  return (
    <form onSubmit={form.onSubmit((values) => handleLogin.mutate(values))}>
      <Stack
        w={450}
        m="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image src={logo} w={120} m="auto" />
        <Stack
          style={{
            border: "1px solid rgb(0,0,0,0.2)",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <Title>Affiliate Login</Title>
          <Text c="gray">Sign in to your account</Text>
          <InputField
            placeholder={"Email"}
            required={true}
            form={form}
            leftSection={<Mail size={16} />}
            validateName={"Email"}
          />
          <PasswordInput
            placeholder="Password"
            leftSection={<Lock size={16} />}
            size="md"
            withAsterisk
            {...form.getInputProps("Password")}
          />
          <Button
            label={"Sign in"}
            type={"submit"}
            loading={handleLogin.isLoading}
          />
          <Group justify="center" mt="sm">
            <Text size="sm" c="dimmed">
              Admin login?{" "}
              <Anchor
                component="button"
                type="button"
                onClick={() => navigate("/signin")}
                size="sm"
              >
                Login here
              </Anchor>
            </Text>
          </Group>
        </Stack>
      </Stack>
    </form>
  );
};

export default AffiliateLogin;
