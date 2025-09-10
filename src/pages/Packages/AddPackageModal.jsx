import { ActionIcon, Group, Modal, Stack, FileInput, Switch } from "@mantine/core";
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
import { Photo } from "tabler-icons-react";

const AddUserModal = ({ edit = false, data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Name: "",
      Price: "",
      Coins: "",
      FreeCoins: "",
      FreeCoinsText: "",
      PackageImage: null,
      IsBanner: false,
    },
  });
  useEffect(() => {
    form.setValues(data);
  }, [data, opened]);
  const handleAddUser = useMutation(
    async (values) => {
       let formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("Price", values.Price);
      formData.append("Coins", values.Coins);
      formData.append("FreeCoins", values.FreeCoins);
      formData.append("FreeCoinsText", values.FreeCoinsText); 
      formData.append("IsBanner", values.IsBanner);
      if (values.PackageImage) {
        formData.append("PackageImage", values.PackageImage);
      }
      let link = backendUrl + "/packages";
      if (edit) {
        formData.append("Id", data._id);
        link = link + `/update`;
        return axios.post(link, formData, {});
      } else {
        link = link + "/add";
        return axios.post(link, formData, {});
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
            <InputField
              label={"Free Coins Text"}
              form={form}
              validateName={"FreeCoinsText"}
              placeholder="e.g., 10 GT Free Coins"
            /> 
            <FileInput
              label="Package Image"
              size="md"
              placeholder="Upload JPG/PNG image"
              radius={"md"}
              leftSection={<Photo width={30} />}
              {...form.getInputProps("PackageImage")}
            />
            <Switch
              label="Banner Package"
              description="Mark this package as a banner package"
              {...form.getInputProps("IsBanner", { type: 'checkbox' })}
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
