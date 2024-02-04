const yamlEditor1 = (
    function() {
        const yamlEditor1 = ace.edit("yamlEditor");
        yamlEditor1.setTheme("ace/theme/monokai");
        yamlEditor1.getSession().setMode("ace/mode/yaml");
        const fontSize = 16;
        yamlEditor1.setFontSize(fontSize);
        return yamlEditor1;
    }
)();
         
function uploadCoreInputs() {
    const handler = function (textContent) {
        yamlEditor1.setValue(textContent)
    };
    uploadFile({extensions: ".yaml, .yml", textHandler: handler} );
}

async function saveFile() {
    const content = yamlEditor1.getValue();

    try {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: "yaml_content.yml",
            types: [{
                description: 'YAML Files',
                accept: {
                    'application/x-yaml': ['.yml', '.yaml'],
                },
            }],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(content);
        await writableStream.close();
    } catch (error) {
        console.error('Error saving file:', error);
    }
}
