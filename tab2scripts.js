var matrixData = {};

function getProductColumns(rootInputsMap) {
    const productList = [];
    const products = rootInputsMap.products;
    for (const productId in products) {
        if (products.hasOwnProperty(productId)) {
            productList.push({
                id: productId,
                title: products[productId],
            });
        }
    }
    return productList;
}

function getFeatureRows(rootInputsMap) {
    const featureList = [];
    const features = rootInputsMap.features;
    for (const featureId in features) {
        if (features.hasOwnProperty(featureId)) {
            const feature = features[featureId];
            const scores = feature.scores || {};
            const productScores = Object.entries(scores).map(([productId, score]) => ({
                id: productId,
                score: score,
            }));
            featureList.push({
                id: featureId,
                title: feature.title,
                productScores: productScores,
            });
        }
    }
    return featureList;
}

function updateMatrixWithRootInputs() {
   const yamlContent = yamlEditor1.getValue();
   const rootInputsMap = jsyaml.load(yamlContent);
   console.log("Loaded root inputs map:", rootInputsMap);
   matrixData.columns = getProductColumns(rootInputsMap);
   matrixData.rows = getFeatureRows(rootInputsMap);
   matrixData.features = rootInputsMap.features;
   renderMatrix();
}

function renderMatrix() {
    var templateSource = document.getElementById("matrix-template").innerHTML;
    var template = Handlebars.compile(templateSource);

    var colspan = matrixData.columns.length + 2;

    var matrixHTML = template({ ...matrixData, colspan: colspan });
    document.getElementById("worksheet").innerHTML = matrixHTML;

    refreshMatrix();
}

function updateTotalCell(productId) {
    var totalCellId = productId + "-total-cell";
    var totalCell = document.getElementById(totalCellId);

    var sum = 0;
    matrixData.rows.forEach(function (row) {
        var featureId = row.id;
        var cellId = featureId + "-" + productId + "-cell";
        var cellContent = document.getElementById(cellId).innerHTML;
        sum += parseFloat(cellContent) || 0;
    });

    totalCell.innerHTML = sum;
}

function refreshMatrix() {
    const features = matrixData.features;
    matrixData.columns.forEach(function (column) {
        var productId = column.id;

        matrixData.rows.forEach(function (row) {
            var featureId = row.id;
            var customWeight = document.getElementById(featureId + "-customWeight").value;
            var cellId = featureId + "-" + productId + "-cell";
            var cell = document.getElementById(cellId);
            var score = features[featureId].scores[productId];
            var result = customWeight * score;

            cell.innerHTML = result;
        });

        updateTotalCell(productId);
    });
}

function chooseWeightsFile() {
    const handler = function (textContent) {
        var parsedData = jsyaml.load(textContent);
        matrixData.rows.forEach(function (row) {
            var featureId = row.id;
            var customWeight = parsedData[featureId] || 1;
            document.getElementById(featureId + "-customWeight").value = customWeight;
        });
        refreshMatrix();
    };
    uploadFile({extendsions: ".yaml, .yml", textHandler: handler});
}
