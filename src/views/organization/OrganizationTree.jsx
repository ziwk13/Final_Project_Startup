import React, { useEffect, useState } from "react";
import { organizationAPI } from "../../api/organizationApi";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


export default function OrganizationTree({ setSelectedDept }) {
    const [ departments, setDepartments ] = useState([]);

    useEffect(() => {
        organizationAPI
        .getDepartments()
        .then((data) => setDepartments(data || []))
        .catch((err) => console.error("부서 가져오기 실패", err));
    }, []);

  const handleSelect = (event, nodeId) => {
    setSelectedDept(nodeId);
    console.log("클릭된 부서 코드:", nodeId);
  };

    const renderTree = (parentCode) => {
        const children = departments.filter((d) => (d.value2 ?? null) === parentCode);

        if (children.length === 0) return null;

        return children.map((child) => (

            <TreeItem
                key={child.code}
                itemId={child.code}
                label={child.value1}
                >
                    {renderTree(child.code)}
                </TreeItem>
        ));
    };

    const roots = departments.filter((d) => (d.value2 ?? null) === null);

    return (
       <SimpleTreeView
  slots={{
    defaultCollapseIcon: ExpandMoreIcon,
    defaultExpandIcon: ChevronRightIcon,
  }}
  sx={{ height: "100%", flexGrow: 1, overflowY: "auto" }}
>

            {roots.map((root) => (
                <TreeItem
                    key={root.code}
                    itemId={root.code}
                    label={root.value1}
                    >
                        {renderTree(root.code)}
                    </TreeItem>
            ))}
        </SimpleTreeView>
    );

}