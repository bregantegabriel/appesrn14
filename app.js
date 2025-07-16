const iconosPorMateria = {
  "Tecnología de la Conectividad": "fa-network-wired",
  "Aplicaciones Informáticas": "fa-laptop-code",
  "Matemática": "fa-square-root-alt",
  // icono por defecto si no matchea
};

const app = document.getElementById('app');
//const DATA_URL = 'data.json';
const DATA_URL = 'http://192.168.1.2/notasappv2/data.json';

function guardarID(id) {
  localStorage.setItem('estudianteID', id);
}

function obtenerID() {
  return localStorage.getItem('estudianteID');
}

function pedirID() {
  app.innerHTML = `
    <h2>ID:</h2>
    <input type="text" id="inputID" class="rell-2 w-75" />
    <button onclick="enviarID()" class="m-sup rell f-verde-oscuro no-bordes red t-blanco w-75 txt-18">Mis notas</button>
  `;
}

function enviarID() {
  const id = document.getElementById('inputID').value.trim();
  if (id) {
    guardarID(id);
    mostrarNotas(id);
  }
}

function mostrarCargando() {
  app.innerHTML = `<p>🔄 Verificando actualización de notas...</p>`;
}

async function mostrarNotas(id) {
  mostrarCargando();
  try {
    const response = await fetch(DATA_URL + '?v=' + Date.now());
    const data = await response.json();

    const actividades = data.actividades;
    const estudiante = data.estudiantes[id];

    if (!estudiante) {
      app.innerHTML = `<p class="txt-18 centrado"><b>ID</b> no encontrado. <button onclick="reiniciar()" class="m-sup rell f-verde-oscuro no-bordes red t-blanco w-75 txt-18">Intentar de nuevo</button></p>`;
      return;
    }

    //app.innerHTML = `<h2><i class="fa fa-user"></i> ${estudiante.nombre}</h2>`;
     document.getElementById('titulo-header').innerHTML = `<i class="fa fa-user fa-sm"></i> ${estudiante.nombre}`;
     app.innerHTML = '';

    const materias = Object.keys(estudiante.notas);

    materias.forEach((materia) => {
      const materiaNotas = estudiante.notas[materia];
      const materiaActividades = actividades[materia];

      if (!materiaActividades || !materiaNotas) return;

      const materiaSection = document.createElement('section');
      materiaSection.className = 'materia sombra-3 w-90 red rell f-blanco m-sup m-inf ';
      const icono = iconosPorMateria[materia] || "fa-book"; // ícono por defecto si no hay
      materiaSection.innerHTML = `<h4 class="m-sup m-inf"><i class="fa ${icono}"></i> <b>${materia.toUpperCase()}</b></h4>`;

      for (const cuatrim in materiaActividades) {
        const actividadesCuatrim = materiaActividades[cuatrim];
        const notasCuatrim = materiaNotas[cuatrim];

        if (!notasCuatrim) continue;

        const cuatrimSection = document.createElement('section');
        cuatrimSection.className = 'cuatrimestre m-sup';
        cuatrimSection.innerHTML = `<h4>${cuatrim}° Cuatrimestre</h4>`;
 
        const ul = document.createElement('ul');
        ul.className = 'actividades';

        for (let i = 0; i < actividadesCuatrim.length; i++) {
  const act = actividadesCuatrim[i];
  const nota = notasCuatrim[i];

  // Omitir "Nota final" si no hay nota (cuatrimestre aún no cerrado)
  if (act.toLowerCase().includes('nota final') && !nota) continue;

  const li = document.createElement('li');
  li.classList.add('flex', 'flex-entre', 'rell-2', 'borde-inf', 'txt-14');  
  if (i === 0) {
    li.classList.add('m-sup'); // tu clase personalizada
  }

  // Destacar visualmente si es "Nota final" con nota asignada
  if (act.toLowerCase().includes('nota final') && nota) {
    li.classList.add('nota-final', 'm-inf');
  }

  li.innerHTML = `<span>${act}</span><span><b>${nota || '-'}</b></span>`;
  
  if (act.toLowerCase().includes('nota final')) {
    li.classList.add('borde-izq-verde', 'f-verde-claro', 't-negrita');
  }

  ul.appendChild(li);
}


        cuatrimSection.appendChild(ul);
        materiaSection.appendChild(cuatrimSection);
      }

      app.appendChild(materiaSection);
    });
  } catch (error) {
    app.innerHTML = `<p>Error al cargar los datos. Intenta de nuevo más tarde.</p>`;
    console.error(error);
  }
}

function reiniciar() {
  localStorage.removeItem('estudianteID');
  document.getElementById('titulo-header').textContent = 'Notas Estudiantiles';
  pedirID();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

const id = obtenerID();
if (id) {
  mostrarNotas(id);
} else {
  pedirID();
}

function reiniciar() {
  localStorage.removeItem('estudianteID');
  document.getElementById('titulo-header').textContent = 'Notas Estudiantiles';
  pedirID();
}
