import {
    initializeBlock,
    useBase,
    useGlobalConfig,
    TablePickerSynced,
    FieldPickerSynced,
    InputSynced,
    Button,
} from "@airtable/blocks/ui";
import React from "react";

function ReplaceMultiSelectOptionsApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const selectedTableId = globalConfig.get("selectedTableId");
    const selectedFieldId = globalConfig.get("selectedFieldId");
    const newOptionsString = globalConfig.get("newOptions");

    const table = base.getTableByIdIfExists(selectedTableId);
    let field;

    if (table) {
        field = table.getFieldByIdIfExists(selectedFieldId);
    }

    const replaceOptions = async () => {
        console.log("Replace Options clicked"); // Debug line

        if (!field) {
            console.log("Field not found");
            return;
        }

        console.log(`Field type: ${field.type}`); // Debug line

        if (field && field.type === "multipleSelects") {
            // Make sure this matches your actual field type
            console.log("Attempting to replace options"); // Debug line

            const parsedNewOptions = newOptionsString
                .split(",")
                .map((option) => option.trim());

            const newOptionObjects = parsedNewOptions.map((optionName) => {
                return { name: optionName };
            });

            if (field.hasPermissionToUpdateOptions({ choices: newOptionObjects })) {
                console.log("Has permission to update"); // Debug line
                await field
                    .updateOptionsAsync({ choices: newOptionObjects })
                    .then(() => {
                        console.log("Options updated"); // Debug line
                    })
                    .catch((error) => {
                        console.log(`Error in updating options: ${error}`); // Debug line
                    });
            } else {
                console.log("No permission to update options"); // Debug line
            }
        } else {
            console.log("Field type doesn't match"); // Debug line
        }
    };

    return (
        <div>
            <h1>Replace Multi-Select Options</h1>

            <TablePickerSynced globalConfigKey="selectedTableId" />
            <FieldPickerSynced table={table} globalConfigKey="selectedFieldId" />
            <InputSynced globalConfigKey="newOptions" />

            <Button onClick={replaceOptions}>Replace Options</Button>
        </div>
    );
}

initializeBlock(() => <ReplaceMultiSelectOptionsApp />);
