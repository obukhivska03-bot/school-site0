
const defaultGame = {
    lives: 3,
    completed: [],
    events: [],
    started: false
};

function getGame() {
    try {
        const saved = localStorage.getItem("schoolSurvival28");

        if (saved) {
            return { ...defaultGame, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.log("Не вдалося прочитати збереження гри.");
    }

    return { ...defaultGame };
}

function saveGame(game) {
    localStorage.setItem("schoolSurvival28", JSON.stringify(game));
}

function startGame() {
    const game = {
        lives: 3,
        completed: [],
        events: [],
        started: true
    };

    saveGame(game);
    window.location.href = "floors.html";
}

function updateStatus() {
    const game = getGame();

    const livesElement = document.getElementById("lives");
    const progressElement = document.getElementById("progress");

    if (livesElement) {
        livesElement.textContent =
            "❤️ ".repeat(Math.max(0, game.lives)) +
            "🖤 ".repeat(Math.max(0, 3 - game.lives));
    }

    if (progressElement) {
        progressElement.textContent = game.completed.length + " / 3";
    }
}

const eventsByFloor = {
    1: [
        {
            text: "Ти зустрів дирекцію. На щастя, сьогодні все обійшлося. Але ти трохи понервував.",
            effect: 0
        },
        {
            text: "Черга в їдальні виявилася довшою, ніж ти очікував. Мінус одне життя!",
            effect: -1
        },
        {
            text: "Ти встиг поїсти! Отримуєш бонус — одне додаткове життя.",
            effect: 1
        },
        {
            text: "Ти випадково потрапив на проєкт біля актової зали. Було цікаво, і ти нічого не втратив.",
            effect: 0
        },
        {
            text: "Ти побачив кабінет Ольги Григорівни. Сьогодні тобі пощастило пройти повз.",
            effect: 0
        }
    ],

    2: [
        {
            text: "Ти побачив тенісний стіл і вирішив зіграти. Перерва вдалася!",
            effect: 1
        },
        {
            text: "Ти так захопився грою, що забув про час. Мінус одне життя!",
            effect: -1
        },
        {
            text: "Зустрів друзів і весело провів перерву. Життя залишається при тобі.",
            effect: 0
        },
        {
            text: "Ти спокійно дійшов до потрібного кабінету. Ніяких пригод!",
            effect: 0
        }
    ],

    3: [
        {
            text: "Ти знайшов цікаву книжку біля стійки. Отримуєш додаткове життя!",
            effect: 1
        },
        {
            text: "Третій поверх зустрів тебе тишею. Можна нарешті відпочити.",
            effect: 0
        },
        {
            text: "Підйом виявився непростим. Ти трохи втомився. Мінус одне життя!",
            effect: -1
        },
        {
            text: "Ти знайшов спокійне місце й відпочив. Сьогодні удача на твоєму боці!",
            effect: 0
        }
    ]
};

function randomEvent(floor) {
    let game = getGame();

    if (!game.started) {
        game.started = true;
    }

    if (game.lives <= 0) {
        showResult();
        return;
    }

    if (game.events.includes(floor)) {
        alert("Ти вже отримав випадкову подію на цьому поверсі!");
        return;
    }

    const events = eventsByFloor[floor];
    const event = events[Math.floor(Math.random() * events.length)];

    game.lives += event.effect;

    if (game.lives > 3) {
        game.lives = 3;
    }

    if (game.lives < 0) {
        game.lives = 0;
    }

    game.events.push(floor);
    saveGame(game);

    const resultElement = document.getElementById("event-" + floor);

    if (resultElement) {
        resultElement.textContent = event.text;
        resultElement.classList.add("visible");
    }

    updateStatus();

    if (game.lives <= 0) {
        setTimeout(showResult, 1800);
    }
}

function completeFloor(floor) {
    let game = getGame();

    if (game.lives <= 0) {
        showResult();
        return;
    }

    if (game.completed.includes(floor)) {
        alert("Цей поверх уже пройдено!");
        return;
    }

    const expectedFloor = game.completed.length + 1;

    if (floor !== expectedFloor) {
        alert("Спочатку потрібно пройти попередній поверх!");
        return;
    }

    game.completed.push(floor);
    saveGame(game);

    if (floor === 3) {
        showResult();
        return;
    }

    updateStatus();

    const nextFloor = document.querySelector(
        floor === 1 ? ".floor-two" : ".floor-three"
    );

    if (nextFloor) {
        nextFloor.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function showResult() {
    const game = getGame();

    if (game.lives > 0 && game.completed.length === 3) {
        localStorage.setItem("schoolSurvivalResult", "win");
    } else {
        localStorage.setItem("schoolSurvivalResult", "lose");
    }

    window.location.href = "result.html";
}

function displayResult() {
    const game = getGame();
    const result = localStorage.getItem("schoolSurvivalResult");

    const title = document.getElementById("result-title");
    const description = document.getElementById("result-description");
    const icon = document.getElementById("result-icon");
    const lives = document.getElementById("final-lives");
    const floors = document.getElementById("final-floors");

    if (!title) return;

    if (result === "win") {
        title.textContent = "ТИ ВИЖИВ У НАШІЙ ШКОЛІ!";
        description.textContent =
            "Три поверхи пройдено! Ти впорався з усіма несподіванками. Тепер можна спокійно видихнути.";
        icon.textContent = "🏆";
    } else {
        title.textContent = "ШКОЛА ТЕБЕ ПЕРЕМОГЛА!";
        description.textContent =
            "Цього разу удача була не на твоєму боці. Але не засмучуйся — можна спробувати ще раз!";
        icon.textContent = "💀";
    }

    if (lives) {
        lives.textContent = game.lives;
    }

    if (floors) {
        floors.textContent = game.completed.length;
    }
}

function resetGame() {
    localStorage.removeItem("schoolSurvival28");
    localStorage.removeItem("schoolSurvivalResult");

    startGame();
}

document.addEventListener("DOMContentLoaded", function () {
    updateStatus();
    displayResult();
});
