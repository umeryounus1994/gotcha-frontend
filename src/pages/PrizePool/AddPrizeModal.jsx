import { ActionIcon, Group, Modal, Stack, FileInput } from "@mantine/core";
import React, { useContext, useEffect } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import InputField from "../../components/general/InputField";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";
import { Pencil, Photo } from "tabler-icons-react";

const AddPrizeModal = ({ edit = false, data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Product: "",
      SKUPhoto: null,
      Rarity: 1,
      MaxPerDay: 1,
      PrizeValue: "",
    },
    validate: {
      Product: (value) => (value?.length > 0 ? null : "Enter Product Name"),
      Rarity: (value) => (value >= 1 ? null : "Rarity must be at least 1"),
      MaxPerDay: (value) => (value >= 1 ? null : "Max Per Day must be at least 1"),
      PrizeValue: (value) => (value >= 0 ? null : "Prize Value must be 0 or greater"),
    },
  });

  useEffect(() => {
    if (data && opened) {
      form.setValues({
        Product: data.Product || "",
        SKUPhoto: null, // Don't pre-populate file
        Rarity: data.Rarity || 1,
        MaxPerDay: data.MaxPerDay || 1,
        PrizeValue: data.PrizeValue || "",
      });
    }
  }, [data, opened]);

  const handleAddPrize = useMutation(
    async (values) => {
      let formData = new FormData();
      formData.append("Product", values.Product);
      formData.append("Rarity", values.Rarity);
      formData.append("MaxPerDay", values.MaxPerDay);
      formData.append("PrizeValue", values.PrizeValue);
      
      if (values.SKUPhoto) {
        formData.append("SKUPhoto", values.SKUPhoto);
      }

      let link = backendUrl + "/main-prize-pool";
      if (edit && data) {
        formData.append("Id", data._id);
        link = link + "/update";
      }

      return axios.post(link, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `${user?.accessToken || ""}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          queryClient.invalidateQueries("fetchPrizePool");
          toggle();
          form.reset();
        } else {
          toast.error(res.data.message || "An error occurred");
        }
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "An error occurred");
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
        <Button label={"Add Prize"} onClick={toggle} />
      )}
      <Modal
        title={edit ? "Edit Prize" : "Add New Prize"}
        opened={opened}
        onClose={() => {
          toggle();
          form.reset();
        }}
        centered
        styles={{ title: { fontWeight: 600 } }}
        size="md"
      >
        <form
          onSubmit={form.onSubmit((values) => handleAddPrize.mutate(values))}
        >
          <Stack>
            <InputField
              label={"Product Name"}
              form={form}
              required={true}
              validateName={"Product"}
              placeholder="e.g., iPhone 16 Pro Max"
            />
            <InputField
              label={"Prize Value (AUD)"}
              type="number"
              form={form}
              validateName={"PrizeValue"}
              required={true}
              placeholder="0"
              min={0}
            />
            <InputField
              label={"Rarity"}
              type="number"
              form={form}
              validateName={"Rarity"}
              placeholder="1"
              min={1}
              description="Higher rarity = more likely to be selected"
            />
            <InputField
              label={"Max Per Day"}
              type="number"
              form={form}
              validateName={"MaxPerDay"}
              placeholder="1"
              min={1}
              description="Maximum times this prize can be dropped per day"
            />
            <FileInput
              label="SKU Photo"
              size="md"
              placeholder="Upload product image (optional)"
              radius={"md"}
              leftSection={<Photo width={30} />}
              accept="image/*"
              {...form.getInputProps("SKUPhoto")}
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
                primary={false}
              />
              <Button
                label={edit ? "Update" : "Add"}
                type={"submit"}
                loading={handleAddPrize.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddPrizeModal;

