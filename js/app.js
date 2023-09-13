const carrito = document.querySelector("#carrito"),
    listaCursos = document.querySelector("#lista-cursos"),
    contenedorCarrito = document.querySelector("#lista-carrito tbody"),
    vaciarCarrito = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

cargarEventListeners(); //lo llamo aquí para que no queden en la ventana global
function cargarEventListeners() {
    //click cuando agregas un curso al carrito "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    //click cuando eliminas un curso
    carrito.addEventListener("click", elmininarCurso);

    //vaciar el carrito
    vaciarCarrito.addEventListener("click", () => {
        //en este caso al ser muy poca lógica la que hay que ejecutar, podemos hacer una función anónima desde aquí

        articulosCarrito = []; // vaciamos el arreglo
        limpiarHTML(); //limpiamos el HTML de los posibles elementos que tuviera el carrito
    });
}

function agregarCurso(e) {
    e.preventDefault(); // al agregar el preventDefault al link, como el href = '#'  iría a un id que nosotros indicáramos, pero al no indicarle nada, se va hacia arriba, con el preventD lo evitamos
    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement; //asi accedo al elemento div padre
        extraerInfo(cursoSeleccionado);
    }
}

function elmininarCurso(e) {
    if (e.target.classList.contains("borrar-curso")) {
        const cursoId = e.target.getAttribute("data-id");

        //elimina del arreglo articulosCarrito por el data-id. Para eliminar usamos un filter para que dentro de articulosCarrito guarde todo el arreglo menos el que quiero sacar, por eso uso !== esto es traeme todos excepto...los que tengan el mismo id
        articulosCarrito = articulosCarrito.filter(
            (curso) => curso.id !== cursoId
        );

        mostrarCarritoHTML(); //llamando a esta función iteramos sobre el carrito y mostramos el HTML actualizado
    }
}

//leemos el html de la tarjeta card y extraemos su contenido
function extraerInfo(cursoSeleccionado) {
    const infoArticulo = {
        imagen: cursoSeleccionado.querySelector("img").src,
        titulo: cursoSeleccionado.querySelector("h4").textContent,
        precio: cursoSeleccionado.querySelector(".precio span").textContent,
        id: cursoSeleccionado.querySelector("a").getAttribute("data-id"),
        cantidad: 1,
    };

    //comprueba si el elemento ya existe en el carrito, usamos some ya que es un objeto
    const siExiste = articulosCarrito.some(
        (curso) => curso.id === infoArticulo.id
    );
    if (siExiste) {
        //actualizamos la cantidad
        const cursosActuales = articulosCarrito.map((item) => {
            if (item.id === infoArticulo.id) {
                item.cantidad += 1;
                return item; //retorna el objeto actualizado
            } else {
                return item; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursosActuales];
    } else {
        //agregamos al carrito
        articulosCarrito = [...articulosCarrito, infoArticulo];
    }

    mostrarCarritoHTML();
}

//muestra el carrito de compras en el HTML
function mostrarCarritoHTML() {
    //Primero limpiamos el HTMl para que no se muestren en el carrito los cursos repetidos
    limpiarHTML();

    //iteramos sobre el arreglo de artículos que tenga el carrito y genera el HTML
    articulosCarrito.forEach((curso) => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        //como se tiene que mostrar en el tbdoy de la tabla, para ello tenemos que ir creando una tr (row) por cada elemento que haya en el arreglo

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>
            <img src=${imagen}>
        </td>
        <td>
        ${titulo}
        </td>
        <td>
        ${precio}
        </td>
        <td>
        ${cantidad}
        </td>
        <td>
        <a href='#' class='borrar-curso' data-id=${id}> X </a>
        </td>
        `;

        //Agregar el HTMl del carrito en el tbody
        contenedorCarrito.appendChild(newRow);
    });
}

//elimina los cursos repetidos del HTML
function limpiarHTML() {
    //esto da una performance muy lenta:  contenedorCarrito.innerHTML = ""; //se limpia el arreglo

    //forma más óptima. Mientras que dentro de contenedorCarrito haya un hijo, borra, cuando ya no haya más, deja de ejecutarse
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
