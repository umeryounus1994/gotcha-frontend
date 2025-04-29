import { ActionIcon, Group, Modal, PasswordInput, Stack } from "@mantine/core";
import React, { useContext, useEffect } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import InputField from "../../components/general/InputField";
import SelectMenu from "../../components/general/SelectMenu";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";
import { Pencil } from "tabler-icons-react";

const AddUserModal = ({ edit = false, data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Name: "",
      Price: "",
      Coints: "",
      FreeCoins: ""
    },
  });
  useEffect(() => {
    form.setValues(data);
  }, [data, opened]);
  const handleAddUser = useMutation(
    async (values) => {
      let link = backendUrl + "/packages";
      if (edit) {
        values.Id = data._id;
        link = link + `/update`;
        return axios.post(link, values, {});
      } else {
        link = link + "/add";
        return axios.post(link, values, {});
      }
    },
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        queryClient.invalidateQueries("fetchPackages");
        toggle();
        form.reset();
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );
  return (
    <>
      {edit ? (
        <ActionIcon onClick={toggle}>
          <Pencil />
        </ActionIcon>
      ) : (
        <Button label={"Add Package"} onClick={toggle} />
      )}
      <Modal
        title="Adding Package"
        opened={opened}
        onClose={toggle}
        centered
        styles={{ title: { fontWeight: 600 } }}
      >
        <form
          onSubmit={form.onSubmit((values) => handleAddUser.mutate(values))}
        >
          <Stack>
            <InputField
              label={"Name"}
              form={form}
              required={true}
              validateName={"Name"}
            />
            <InputField
              label={"Price"}
              form={form}
              required={true}
              validateName={"Price"}
            />
            <InputField
              label={"Coins"}
              type="number"
              form={form}
              validateName={"Coins"}
              required={true}
            />
             <InputField
              label={"Free Coins"}
              type="number"
              form={form}
              validateName={"FreeCoins"}
            />

            <Group gap={"md"} justify="flex-end" mt="md">
              <Button
                label={"Cancel"}
                onClick={() => {
                  toggle();
                  form.reset();
                }}
                variant="outline"
                bg="gray"
              />
              <Button
                label={edit ? "Update" : "Add"}
                type={"submit"}
                loading={handleAddUser.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddUserModal;
