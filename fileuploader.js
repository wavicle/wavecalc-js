function uploadFile({extensions, textHandler}) {
    var input = document.createElement('input');
    input.type = 'file';
    input.extenions = extensions;
    input.addEventListener('change', function() {
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileContents = e.target.result;
                textHandler(fileContents);
            };
            reader.readAsText(file);
        }
    });
    input.click();
}
