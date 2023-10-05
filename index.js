let baseUrl = 'https://65147d8bdc3282a6a3cd3cda.mockapi.io';
let bicicletaArray = [];
class Bicicletas {

    constructor({ id, rodado, precio, color, estado }) {
        this.id = id;
        this.rodado = rodado;
        this.precio = precio;
        this.color = color;
        this.estado = estado;
    }

    recargo() {
        return this.precio * 1.30;
    }
}

bicicletaArray = buscarTodosLosDatos();




async function buscarTodosLosDatos() {
    try {
        const resp = await fetch(`${baseUrl}/Bicicletas`);

        if (!resp.ok) {
            throw new Error(`Error al buscar datos: ${resp.status}`);
        }

        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(`Error al buscar datos de la API: ${error.message}`);
        throw error;
    }
}




////--------------Mostrar Datos bicicletas--------------------

const mostrarBoton = document.getElementById("mostrar");
mostrarBoton.addEventListener("click", mostrarNavBicicletas);


async function mostrarNavBicicletas() {
    mostrarBicicletas();
    noMostrarAgregarBicicletas();
    noMostrarAlquilerBicicletas();
    noMostrarCobroBicicletas();
    noMostrarTotal();
    noMostrarCobroBicicletasBoton();

    let datosbici = await buscarTodosLosDatos();

    if (datosbici && Array.isArray(datosbici)) {
        bicicletaArray = datosbici;
        crearTemplate();
    } else {
        templateVacio();
    }
}

function crearTemplate() {

    contenedorBicicletas.innerHTML = "";
    bicicletaArray.forEach((bicicleta) => {
        contenedorBicicletas.innerHTML += `
            <div class="bicicleta">
                <p>ID: ${bicicleta.id}</p>
                <p>Rodado: ${bicicleta.rodado}</p>
                <p>Precio: ${bicicleta.precio}</p>
                <p>Color: ${bicicleta.color}</p>
                <p>Estado: ${bicicleta.estado}</p>
                <div class="btnBicicleta">
                <button class="btnBorrar" id="${bicicleta.id}">Borrar</button>
                </div>
            </div>
        `;
    });

    const btnBorrar = document.querySelectorAll('.btnBorrar');
    borrarBicicleta(btnBorrar);
}



//--------------Borrar Datos bicicletas--------------------


async function borrarBicicleta(selectores) {
    selectores.forEach((selector) => {
        selector.addEventListener('click', async (e) => {

            const id = e.target.id;
            const bicicleta = bicicletaArray.find((dato) => dato.id === id);

            if (bicicleta && bicicleta.estado === "Disponible") {
                try {
                    await eliminarUnProducto(id);
                    bicicletaArray = await buscarTodosLosDatos();
                    crearTemplate();
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `No se puede eliminar bicletas alquiladas!`,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    });
}


async function eliminarUnProducto(id) {
    try {
        const resp = await fetch(`${baseUrl}/Bicicletas/${id}`, {
            method: "DELETE"
        })
        if (!resp.ok) {
            throw new Error(`Error al buscar datos: ${resp.status}`);
        }

        const data = await resp.json();

    } catch (error) {
        console.error(`Error al buscar datos de la API: ${error.message}`);
        throw error;
    }
}


//--------------Agregar Datos bicicletas--------------------

const agregarBoton = document.getElementById("agregar");
agregarBoton.addEventListener("click", agregarBicicleta);

async function agregarBicicleta() {

    noMostrarBicicletas();
    mostrarAgregarBicicletas();
    noMostrarAlquilerBicicletas();
    noMostrarCobroBicicletas();
    noMostrarTotal();
    noMostrarCobroBicicletasBoton();


    const nuevoBoton = document.getElementById("nuevo");
    nuevoBoton.addEventListener("click", nuevaBicicleta);
}


async function nuevaBicicleta(event) {
    event.preventDefault();
    const inputsFormularioNuevaBici = document.querySelectorAll('.input');
    const precio = parseFloat(inputsFormularioNuevaBici[1].value);
    if (isNaN(precio) || precio >= 0) {
        const rodado = inputsFormularioNuevaBici[0].value;
        const color = inputsFormularioNuevaBici[2].value;
        const estado = "Disponible";

        const bicicleta = {
            rodado,
            precio,
            color,
            estado,
        };

        Swal.fire({
            title: 'Perfecto!!',
            text: 'Se agregó una nueva Bicicleta',
            imageUrl: './img/nueva_bici.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Nueva Bicicleta',
            customClass: {
                container: 'adapta-animacion' 
            },
            showClass: {
                popup: 'animated fadeInDown'
            },
            timer: 3000
        });
        inputsFormularioNuevaBici[1].value = "";
        noMostrarAgregarBicicletas();

        await agregarProducto(bicicleta);
    }
}

async function agregarProducto(objeto) {
    try {
        const resp = await fetch(`${baseUrl}/Bicicletas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(objeto)

        });
        const data = await resp.json();
    } catch (error) {
        console.error("Error de red:", error);
        return null;
    }
}





//---------------Alquiler bicicletas-------------------
const botonAlquilar = document.getElementById("alquilar");
botonAlquilar.addEventListener("click", alquilarBicicleta);


async function alquilarBicicleta() {

    noMostrarBicicletas();
    noMostrarAgregarBicicletas();
    mostrarAlquilerBicicletas();
    noMostrarCobroBicicletas();
    noMostrarTotal();
    noMostrarCobroBicicletasBoton();

    bicicletaArray = await buscarTodosLosDatos();

    if (Array.isArray(bicicletaArray)) {
        crearTemplateAlquiler();
    } else {
        templateVacio();
    }
}


function crearTemplateAlquiler() {
    contenedorBicicletasAlquiladas.innerHTML = "";
    if (Array.isArray(bicicletaArray)) {
        bicicletaArray.forEach((bicicleta) => {
            contenedorBicicletasAlquiladas.innerHTML += `
                <div class="alquiler">
                    <p>ID: ${bicicleta.id}</p>
                    <p>Rodado: ${bicicleta.rodado}</p>
                    <p>Precio: ${bicicleta.precio}</p>
                    <p>Color: ${bicicleta.color}</p>
                    <p>Estado: ${bicicleta.estado}</p>
                    <div class="btnBicicleta">
                    <button class="btnAlquilar" id="${bicicleta.id}">Alquilar</button>
                    </div>
                </div>
            `;
        });
        const btnAlquilar = document.querySelectorAll('.btnAlquilar')
        marcarAlquilerBicicleta(btnAlquilar)
    } else {
        templateVacio();
    }
}

async function marcarAlquilerBicicleta(selectores) {
    selectores.forEach((selector) => {
        selector.addEventListener('click', async (e) => {

            const id = e.target.id;
            const bicicletaIndex = bicicletaArray.findIndex((bici) => bici.id === id);

            if (bicicletaIndex !== -1 && bicicletaArray[bicicletaIndex].estado === "Disponible") {

                bicicletaArray[bicicletaIndex].estado = "Alquilado";
                await editarProducto(bicicletaArray[bicicletaIndex], id);
                crearTemplateAlquiler();
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `No se puede alquilar bicletas ya alquiladas!`,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    });
}


async function editarProducto(objeto, id) {
    const resp = await fetch(`${baseUrl}/Bicicletas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(objeto)
    })
    const data = await resp.json()

}


//---------------Cobro bicicletas-------------------

const botonCobrar = document.getElementById("cobrar");
botonCobrar.addEventListener("click", cobrarBicicleta);

async function cobrarBicicleta() {

    noMostrarBicicletas();
    noMostrarAgregarBicicletas();
    noMostrarAlquilerBicicletas();
    noMostrarTotal();
    mostrarCobroBicicletas();
    noMostrarCobroBicicletasBoton();
    clickCobroBicicletasBoton();

    bicicletaArray = await buscarTodosLosDatos();

    if (Array.isArray(bicicletaArray)) {
        crearTemplateCobrar();
    } else {
        templateVacio();
    }
}


function crearTemplateCobrar() {


    let validaBoton = false;

    contenedorBicicletasCobradas.innerHTML = "";
    bicicletaArray.forEach((bicicleta) => {
        if (bicicleta.estado === "Alquilado") {
            mostrarCobroBicicletasBoton();
            contenedorBicicletasCobradas.innerHTML += `
            <div class="bicicleta">
                <p>ID: ${bicicleta.id}</p>
                <p>Rodado: ${bicicleta.rodado}</p>
                <p>Precio: ${bicicleta.precio}</p>
                <p>Color: ${bicicleta.color}</p>
                <p>Estado: ${bicicleta.estado}</p>
                <input type="checkbox" class="chkAlquilar" id="${bicicleta.id}">
            </div>
        `;
        }

    });

    contenedorBicicletasCobradasBoton.innerHTML = `
    <div class="divBtnCobrarAlquilada">
        <button class="btnCobrarAlquilada" id="">Cobrar Bicicletas</button>
    </div>
`;

    const btnCobrarAlquilada = document.querySelector(".btnCobrarAlquilada");
    btnCobrarAlquilada.addEventListener("click", marcarCobrarBicicleta);
}


async function marcarCobrarBicicleta(selectores) {
    let total = 0;
    console.clear();

    for (let i = 0; i < bicicletaArray.length; i++) {
        const bicicleta = bicicletaArray[i];
        const checkbox = document.getElementById(bicicleta.id);

        if (checkbox && checkbox.checked && bicicleta.estado === "Alquilado") {
            total += bicicleta.precio;
            bicicletaArray[i].estado = "Disponible";
            await editarProducto(bicicletaArray[i], bicicleta.id);

        }
    }

    noMostrarCobroBicicletas();
    noClickCobroBicicletasBoton();
    if (total > 0) {
        noClickCobroBicicletasBoton();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `TOTAL: $${total}`,
            showConfirmButton: true,
        })
    }
}


//---------------Prende/Apaga-------------------

function noMostrarTotal() {
    const contenedorTotal = document.getElementById("contenedorTotal");
    contenedorTotal.style.display = "none";
}

function mostrarTotal() {
    const contenedorTotal = document.getElementById("contenedorTotal");
    contenedorTotal.style.display = "block";
}

function noMostrarCobroBicicletasBoton() {
    const contenedorBicicletasCobradasBoton = document.getElementById("contenedorBicicletasCobradasBoton");
    contenedorBicicletasCobradasBoton.style.display = "none";
}

function mostrarCobroBicicletasBoton() {
    const contenedorBicicletasCobradasBoton = document.getElementById("contenedorBicicletasCobradasBoton");
    contenedorBicicletasCobradasBoton.style.display = "block";
}

function clickCobroBicicletasBoton() {
    const contenedorBicicletasCobradasBoton = document.getElementById("contenedorBicicletasCobradasBoton");
    contenedorBicicletasCobradasBoton.classList.remove("disable");
}


function noClickCobroBicicletasBoton() {
    const contenedorBicicletasCobradasBoton = document.getElementById("contenedorBicicletasCobradasBoton");
    contenedorBicicletasCobradasBoton.classList.add("disable");
}


function noMostrarCobroBicicletas() {
    const contenedorBicicletasCobradas = document.getElementById("contenedorBicicletasCobradas");
    contenedorBicicletasCobradas.style.display = "none";
}

function mostrarCobroBicicletas() {
    const contenedorBicicletasCobradas = document.getElementById("contenedorBicicletasCobradas");
    contenedorBicicletasCobradas.style.display = "block";
}

function noMostrarAlquilerBicicletas() {
    const contenedorBicicletasAlquiladas = document.getElementById("contenedorBicicletasAlquiladas");
    contenedorBicicletasAlquiladas.style.display = "none";
}

function mostrarAlquilerBicicletas() {
    const contenedorBicicletasAlquiladas = document.getElementById("contenedorBicicletasAlquiladas");
    contenedorBicicletasAlquiladas.style.display = "block";
}

function noMostrarAgregarBicicletas() {
    const formularioAgregar = document.getElementById("formularioAgregar");
    formularioAgregar.classList.add("disable");
}

function mostrarAgregarBicicletas() {
    const formularioAgregar = document.getElementById("formularioAgregar");
    formularioAgregar.classList.remove("disable");
}

function noMostrarBicicletas() {
    const contenedorBicicletas = document.getElementById("contenedorBicicletas");
    contenedorBicicletas.style.display = "none";
}

function mostrarBicicletas() {
    const contenedorBicicletas = document.getElementById("contenedorBicicletas");
    contenedorBicicletas.style.display = "block";
}


//-----------------Validacion vacio --------------------

function templateVacio() {
    const contenedorVacio = document.getElementById("contenedorVacio");
    contenedorVacio.innerHTML = `<div class="vacio">
        <p>No hay bicicletas disponibles</p>
        </div>`;
}


// --------------salir---------------

const salirBoton = document.getElementById("salir");
salirBoton.addEventListener("click", () => {
    document.body.classList.add("disable");
});


