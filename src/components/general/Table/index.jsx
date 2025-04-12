import { Box, Loader, useMantineTheme } from "@mantine/core";
import Papa from "papaparse";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

// import { Download } from "tabler-icons-react";

const customStyles = {
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: 600,
    },
  },
  rows: {
    style: {
      fontSize: "14px",
    },
  },
};

const DataGrid = ({ columns, data, type, download = false, ...props }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [select, setSelected] = useState(null);


  const actionsMemo = React.useMemo(() => {
    const csvData = [];
    data?.forEach((element) => {
      csvData.push({
        "Full Name": element.FullName || "N/A",
        "Email": element.Email || "N/A",
        "Account No.": element?.AccountNumber || "N/A",
        "Phone No.": element.ContactNumber || "N/A",
        "BSB": element.BSB || "N/A",
        "Total Coins": element.TotalCoin,
        "Registration Date": new Date(element.CreationTimestamp).toLocaleDateString(),
        "Premium User" : element.PurchasePackage == true ? 'Yes' : 'No',
        "Status": element?.IsActive == true ? "Active" : "InActive"
      })
    });
    let csv = Papa.unparse(csvData);
    return (
      <Button
        primary={false}
        label={"Download CSV"}
        leftIcon={"download.svg"}
        onClick={() =>
          (location.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`)
        }
      />
    );
  }, [data]);
  return (
    <Box
      style={{
        border: "2px solid #E5E5E5",
        borderRadius: "10px",
        overflow: "hidden",
        // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >

      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        subHeaderAlign="right"
        subHeaderWrap
        //   selectableRows
        //   onSelectedRowsChange={handleChange}
        //   selectableRowsComponent={Checkbox}
        progressComponent={<Loader my={10} color={theme.primaryColor} />}
        actions={download && actionsMemo}
        customStyles={customStyles}
        {...props}
      />
    </Box>
  );
};

export default DataGrid;
