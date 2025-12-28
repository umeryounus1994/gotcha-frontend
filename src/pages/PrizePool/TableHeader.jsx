import { ActionIcon, Badge, Text, Image } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import AddPrizeModal from "./AddPrizeModal";
import { Pencil } from "tabler-icons-react";

export const Columns = () => [
  {
    name: "Product",
    selector: (row) => row.Product,
    width: "200px",
    sortable: true,
  },
  {
    name: "SKU Photo",
    selector: (row) => row.SKUPhoto,
    center: true,
    width: "150px",
    cell: (row) => (
      row.SKUPhoto ? (
        <Image
          src={row.SKUPhoto}
          alt={row.Product}
          width={60}
          height={60}
          fit="cover"
          radius="md"
          style={{ margin: "0 auto" }}
        />
      ) : (
        <Text size="sm" c="dimmed">No image</Text>
      )
    ),
  },
  {
    name: "Rarity",
    selector: (row) => row.Rarity,
    sortable: true,
    center: true,
    width: "100px",
    cell: (row) => <Text fw={500}>{row?.Rarity || 1}</Text>,
  },
  {
    name: "Max Per Day",
    selector: (row) => row.MaxPerDay,
    sortable: true,
    center: true,
    width: "130px",
    cell: (row) => <Text>{row?.MaxPerDay || 1}</Text>,
  },
  {
    name: "Prize Value (AUD)",
    selector: (row) => row.PrizeValue,
    sortable: true,
    center: true,
    width: "150px",
    cell: (row) => <Text fw={500}>${row?.PrizeValue?.toLocaleString() || 0}</Text>,
  },
  {
    name: "Daily Counter",
    selector: (row) => row.DailyCounter,
    center: true,
    width: "130px",
    cell: (row) => (
      <Badge color={row.DailyCounter >= row.MaxPerDay ? "red" : "blue"}>
        {row?.DailyCounter || 0} / {row?.MaxPerDay || 1}
      </Badge>
    ),
  },
  {
    name: "Status",
    selector: (row) => row.IsActive,
    center: true,
    width: "120px",
    cell: (row) => (
      <Badge bg={row.IsActive ? "green" : "red"}>
        {row.IsActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => (
      <ActionIcons
        rowData={row}
        edit={<AddPrizeModal edit={true} data={row} />}
        del={true}
        type="PrizePool"
      />
    ),
  },
];

