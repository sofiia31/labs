async function GetUsers() {
    const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const users = await response.json();
        let rows = document.querySelector("tbody");
        // Очистити вміст таблиці перед додаванням нових даних
        rows.innerHTML = '';
        users.forEach(user => {
            rows.append(row(user));
        });
    }
}

async function GetUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements["id"].value = user._id;
        form.elements["name"].value = user.name;
        form.elements["age"].value = user.age;
    }
}

async function CreateUser(userName, userAge) {
    // Перевірка на введення даних користувачем
    if (!userName || !userAge) {
        alert("Будь ласка, введіть ім'я та вік користувача.");
        return;
    }

    const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });

    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tbody").append(row(user));
    }
}
async function EditUser(userId, userName, userAge) {
    const response = await fetch("/api/users/" + userId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        reset();
        location.reload(); // Оновити сторінку
    }
}

async function DeleteUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        document.querySelector("tr[data-rowid='" + id + "']").remove();
    }
}
async function sortByAge() {
    // Перевірка, чи кнопка "Сортувати за віком" була натиснута

    const response = await fetch("/api/users?sort=age", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const users = await response.json();
        users.sort((a, b) => a.age - b.age); // Сортування за зростанням віку
        renderUsers(users);
    }

}
function renderUsers(users) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    users.forEach(user => {
        tbody.appendChild(row(user));
    });
}
// сброс формы
async function reset() {
    const form = document.forms["userForm"];
    form.reset();
    form.elements["id"].value = 0;
}
function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0) {
        alert("Введіть коректний вік (більше 0).");
        return false;
    }
    return true;
}
// создание строки для таблицы
function row(user) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user._id);

    const idTd = document.createElement("td");
    idTd.append(user._id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(user.name);
    tr.append(nameTd);

    const ageTd = document.createElement("td");
    ageTd.append(user.age);
    tr.append(ageTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", user._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        GetUser(user._id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", user._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {
        e.preventDefault();
        DeleteUser(user._id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
document.getElementById("reset").addEventListener("click", function (e) {
    e.preventDefault();
    reset();
});

// отправка формы
document.forms["userForm"].addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const age = form.elements["age"].value;

    // Валідація введеного віку
    if (!validateAge(age)) {
        return;
    }

    if (id == 0)
        await CreateUser(name, age);
    else
        await EditUser(id, name, age);
});
// загрузка пользователей
GetUsers();