document.addEventListener("DOMContentLoaded", function () {
    const bingoCard = document.getElementById("bingo-card");

    function generateBingoCard() {
        const eventList = document.getElementById("event-list").value.split("\n").filter(event => event.trim() !== "");

        if (eventList.length !== 24) {
            alert("Please enter exactly 24 events (one per line).");
            return;
        }

        const shuffledEvents = shuffleArray(eventList);

        const cells = bingoCard.querySelectorAll(".bingo-cell:not(.free)");
        cells.forEach((cell, index) => {
            cell.textContent = shuffledEvents[index];
        });

        saveBingoCard();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const cells = bingoCard.querySelectorAll(".bingo-cell");
    cells.forEach(cell => {
        cell.addEventListener("click", function () {
            cell.classList.toggle("highlighted");
        });
    });

    function getBingoCardData() {
        const cells = bingoCard.querySelectorAll(".bingo-cell");
        return Array.from(cells).map(cell => ({
            text: cell.textContent,
            highlighted: cell.classList.contains("highlighted")
        }));
    }

    function saveBingoCard() {
        const bingoCardData = {
            id: generateUniqueId(),
            cells: getBingoCardData()
        };
        return bingoCardData;
    }

    function downloadBingoCard() {
        const bingoCardData = saveBingoCard();
        const blob = new Blob([JSON.stringify(bingoCardData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "bingo_card.json";
        link.click();
    }

    function uploadBingoCard(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const bingoCardData = JSON.parse(e.target.result);
                loadBingoCard(bingoCardData);
            };
            reader.readAsText(file);
        }
    }

    function loadBingoCard(data) {
        const cells = bingoCard.querySelectorAll(".bingo-cell");
        data.cells.forEach((cellData, index) => {
            const cell = cells[index];
            cell.textContent = cellData.text;
            if (cellData.highlighted) {
                cell.classList.add("highlighted");
            } else {
                cell.classList.remove("highlighted");
            }
        });
    }

    function clearBingoCard() {
        localStorage.removeItem("bingoCardData");
        const cells = bingoCard.querySelectorAll(".bingo-cell");
        
        const defaultPlaceholders = [
            "Event 1", "Event 2", "Event 3", "Event 4", "Event 5",
            "Event 6", "Event 7", "Event 8", "Event 9", "Event 10",
            "Event 11", "Event 12", "FREE", "Event 13", "Event 14",
            "Event 15", "Event 16", "Event 17", "Event 18", "Event 19",
            "Event 20", "Event 21", "Event 22", "Event 23", "Event 24"
        ];
    
        cells.forEach((cell, index) => {
            cell.textContent = defaultPlaceholders[index];
            cell.classList.remove("highlighted");
        });
    }
    

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    window.generateBingoCard = generateBingoCard;
    window.downloadBingoCard = downloadBingoCard;
    window.uploadBingoCard = uploadBingoCard;
    window.clearBingoCard = clearBingoCard;
});
