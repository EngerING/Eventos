
document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    } else {
        obtenerCategorias();
    }
});

function obtenerCategorias() {
    fetch("http://localhost:8000/internal/categoria-evento/listar", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById("listaCategorias");
        lista.innerHTML = "";
        data.forEach(c => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${c.nombre}</span>
                <button onclick="editarCategoriaPrompt(${c.id}, '${c.nombre}')">Editar</button>
                <button onclick="eliminarCategoria(${c.id})">Eliminar</button>
            `;
            lista.appendChild(li);
        });
    });
}

function crearCategoria() {
    const nombre = document.getElementById("nombreCategoria").value;
    fetch("http://localhost:8000/internal/categoria-evento/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ nombre })
    })
    .then(res => {
        if (res.ok) {
            obtenerCategorias();
            document.getElementById("nombreCategoria").value = "";
        } else {
            alert("Error al crear la categoría.");
        }
    });
}

function editarCategoriaPrompt(id, nombreActual) {
    const nuevoNombre = prompt("Nuevo nombre de la categoría:", nombreActual);
    if (nuevoNombre && nuevoNombre !== nombreActual) {
        fetch(`http://localhost:8000/internal/categoria-evento/actualizar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ nombre: nuevoNombre })
        })
        .then(res => {
            if (res.ok) {
                obtenerCategorias();
            } else {
                alert("Error al actualizar la categoría.");
            }
        });
    }
}

function eliminarCategoria(id) {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
        fetch(`http://localhost:8000/internal/categoria-evento/eliminar/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            if (res.ok) {
                obtenerCategorias();
            } else {
                alert("Error al eliminar la categoría.");
            }
        });
    }
}

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
