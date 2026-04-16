let currentIndex = 0;
let userScores = { 'O': 0, 'C': 0, 'E': 0, 'A': 0, 'N': 0 };
let selectedUniverseData = [];

function batDau() {
    let selectedName = document.getElementById("universeSelect").value;
    selectedUniverseData = universes[selectedName];

    document.getElementById("setup-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";

    hienThiCauHoi();
}

function hienThiCauHoi() {
    if (currentIndex < questionBank.length) {
        document.getElementById("questionText").innerText =
            "[ Câu " + (currentIndex + 1) + " / " + questionBank.length + " ]\n" +
            questionBank[currentIndex].text;

        let phanTram = (currentIndex / questionBank.length) * 100;
        document.getElementById("progressBar").style.width = phanTram + "%";

    } else {
        document.getElementById("progressBar").style.width = "100%";
        setTimeout(tinhToanKetQua, 500);
    }
}

function chonDiem(diem) {
    let q = questionBank[currentIndex];
    let multiplier = 0;

    if (diem === 5) multiplier = 2;
    else if (diem === 4) multiplier = 1;
    else if (diem === 3) multiplier = 0;
    else if (diem === 2) multiplier = -1;
    else if (diem === 1) multiplier = -2;

    for (let trait in q.factors) {
        userScores[trait] += q.factors[trait] * multiplier;
    }

    currentIndex++;
    hienThiCauHoi();
}

function normalize(scoresMap) {
    let sum = 0;
    let traits = ['O', 'C', 'E', 'A', 'N'];
    for (let t of traits) sum += Math.pow((scoresMap[t] || 0), 2);
    let length_of_vector = Math.sqrt(sum);

    let norm = {};
    for (let t of traits) norm[t] = length_of_vector === 0 ? 0 : (scoresMap[t] || 0) / length_of_vector;
    return norm;
}

function cosineSimilarityOf(normUser, normPerson) {
    let traits = ['O', 'C', 'E', 'A', 'N'];
    let similarity = 0;
    for (let t of traits) similarity += (normUser[t] || 0) * (normPerson[t] || 0);
    return similarity;
}

function tinhToanKetQua() {
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("result-section").style.display = "block";

    let scoreHTML = "<ul>";
    for (let t in userScores) {
        scoreHTML += "<li>Chỉ số " + t + ": <span class='highlight'>" + userScores[t] + "</span></li>";
    }
    scoreHTML += "</ul>";
    document.getElementById("scoreOutput").innerHTML = scoreHTML;

    let normUserScores = normalize(userScores);
    let maxCosineSimilarity = -9999;
    let bestMatch = "";

    for (let p of selectedUniverseData) {
        let normPersonScores = normalize(p.scores);
        let curSim = cosineSimilarityOf(normUserScores, normPersonScores);

        if (curSim > maxCosineSimilarity) {
            maxCosineSimilarity = curSim;
            bestMatch = p.name;
        }
    }

    let vuTruName = document.getElementById("universeSelect").value;
    document.getElementById("matchOutput").innerHTML =
        "Nhân vật giống bạn nhất (vũ trụ " + vuTruName + "):<br><strong style='color: #f9e2af; font-size: 24px;'>" + bestMatch + "</strong>";

    let imgElement = document.getElementById("characterImage");

    let safeName = bestMatch.replace(/ /g, "+");
    imgElement.src = "https://ui-avatars.com/api/?name=" + safeName + "&background=random&color=fff&size=200";
    imgElement.style.display = "inline-block";
}