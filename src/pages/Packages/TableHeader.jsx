import { ActionIcon, Badge, Switch, Text, Tooltip } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import AddPackageModal from "./AddPackageModal";
import Button from "../../components/general/Button";
import { Cross, Delete, X } from "lucide-react";

export const Columns = (onHandleStatus, advanced = false) => [
  {
    name: "Name",
    selector: (row) => row.Name,
    width: "200px",
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => row.Price,
    sortable: true,
    // center: true,
    width: "120px",
  },
  {
    name: "Coins",
    selector: (row) => row.Coins,
    sortable: true,
    center: true,
    width: "185px",
    cell: (row) => <Text>{row?.Coins || "N/A"}</Text>,
  },
  {
    name: "Free Coins",
    selector: (row) => row.FreeCoins,
    sortable: true,
    center: true,
    width: "185px",
    cell: (row) => <Text>{row?.FreeCoins || "N/A"}</Text>,
  },
  {
    name: "Is Banner",
    selector: (row) => row.IsBanner,
    center: true,
    width: "180px",
    cell: (row) => (
      <Badge bg={row.IsBanner ? "blue" : "gray"}>
        {row.IsBanner ? "Banner" : "Regular"}
      </Badge>
    ),
  }, 
  {
    name: "Status",
    selector: (row) => row.IsActive,
    center: true,
    width: "200px",
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
      <>
        <ActionIcons
          rowData={row}
          edit={<AddPackageModal edit={true} data={row} />}
          del={true}
          type="Package"
        />
      </>
    ),
  },
];
